import Mysql from './model/db/mysql';
import Bucket from './bucket';
import * as Bull from 'bull';
import { Job, Queue, QueueOptions } from 'bull';
import { getConfig } from '../config-helper';
import { TakeoutResponse, TakeoutRequest, TakeoutState } from 'common';

// How many concurrent takeouts can take place at any time.
const kTakeoutConcurrency = 10;

// How many takeouts can take place per hour.
const kTakeoutRateLimiter: Bull.RateLimiter = { max: 10, duration: 3600 };

// Maximum number of files to include in each archive
const kChunkMaxFiles = 2000;

// How many days takeout archives are kept before getting deleted from S3 and the DB.
const kExpirationDays = 30;

// Margin for error when deleting expiring takeouts from the database.
// When a takeout is this close (in hours) to expiring, remove it.
const kExpirationMarginHours = 3;

// Leave this much time for a takeout to complete. If it does not, it will get removed at cleanup time.
const kStuckDurationHours = 24;

export type TaskQueues = {
  dataTakeout: Queue<TakeoutTask>;
  dataTakeoutCleanup: Queue<{}>;
};

export function createTaskQueues(takeout: Takeout): TaskQueues {
  const redisUrlParts = getConfig().REDIS_URL?.split('//');
  const redisDomain =
    redisUrlParts.length > 1 ? redisUrlParts[1] : redisUrlParts[0];

  let redisOpts: any = { host: redisDomain };
  if (getConfig().REDIS_URL.includes('rediss://')) {
    redisOpts = { ...redisOpts, tls: redisOpts };
  }

  const createQueue = <T>(name: string, params?: QueueOptions) => {
    const bull = new Bull<T>(name, {
      redis: redisOpts,
      prefix: `bull-${name}-`,
      ...params,
    });

    if (getConfig().DEBUG) {
      console.log(bull);
    }

    return bull;
  };

  const dataTakeout = createQueue<TakeoutTask>('data-takeout', {
    limiter: kTakeoutRateLimiter,
  });
  dataTakeout.on('error', console.error);
  dataTakeout.on('failed', console.error);
  dataTakeout.process(
    kTakeoutConcurrency,
    async job => await takeout.takeoutWorker(job)
  );

  const dataTakeoutCleanup = createQueue<{}>('data-takeout-cleanup');
  dataTakeoutCleanup.process(
    1,
    async job => await takeout.takeoutCleanupWorker(job)
  );
  // Do cleanup every hour at :15. No concurrency allowed.
  dataTakeoutCleanup.add({}, { repeat: { cron: '0 15 * * * *' } });

  return { dataTakeout, dataTakeoutCleanup };
}

type TakeoutTask = {
  takeout_id: number;
};

export type ClientClip = {
  original_sentence_id: string;
  sentence: string;
  path: string;
  locale: string;
};

export default class Takeout {
  private readonly db: Mysql;
  private readonly bucket: Bucket;
  private queue: Bull.Queue<TakeoutTask>;

  constructor(db: Mysql, bucket: Bucket) {
    this.db = db;
    this.bucket = bucket;
  }

  setQueue(queue: Bull.Queue<TakeoutTask>) {
    this.queue = queue;
  }

  async startTakeout(client_id: string): Promise<number> {
    // Throws if there is already a running takeout.
    const takeout_id = await this.insertNewTakeout(client_id);
    await this.queue.add({ takeout_id }, { removeOnComplete: true });
    return takeout_id;
  }

  async generateDownloadLinks(
    client_id: string,
    takeout_id: number
  ): Promise<TakeoutResponse> {
    const takeout = await this.getTakeout(takeout_id);
    if (takeout === null) throw 'no such takeout';
    if (takeout.client_id !== client_id) throw 'no such takeout';
    if (takeout.state !== TakeoutState.AVAILABLE)
      throw 'takeout is unavailable';

    const keys = [...Array(takeout.archive_count).keys()].map(offset =>
      this.bucket.takeoutKey(takeout, offset)
    );

    const urls = await Promise.all(keys.map(key => this.bucket.getPublicUrl(key)))

    const links = {
      parts: urls.map(url => decodeURIComponent(url)),
      metadata: decodeURIComponent(await this.bucket.getPublicUrl(this.bucket.metadataKey(takeout))),
    };

    console.log(links)

    return links;
  }

  async getClientClips(client_id: string): Promise<ClientClip[]> {
    // Getting the paths from the db is faster than using S3 listObject, and
    // covers situations where some clients have clips stored under different paths

    const [clips] = await this.db.query(
      `
        SELECT original_sentence_id, sentence, path, name AS locale FROM clips LEFT JOIN locales ON clips.locale_id = locales.id WHERE client_id = ?
      `,
      [client_id]
    );

    return clips;
  }

  async takeoutWorker(job: Job<TakeoutTask>): Promise<void> {
    console.log('performing takeout', job.data.takeout_id);
    const takeout_id = job.data.takeout_id;
    const takeout = await this.getTakeout(takeout_id);
    if (takeout === null) throw 'unknown takeout';

    // As best as I can tell, sometime multiple pods try to initiate the same queue job
    // but throwing an error here will kill that entire job intead of just that pod's attempt
    if (takeout.state !== TakeoutState.PENDING) {
      console.log(
        `takeout ${job.data.takeout_id} already in progress, do nothing`
      );
      return;
    }

    await this.markTakeoutInProgress(takeout_id);

    const clips = await this.getClientClips(takeout.client_id);

    const chunkedClips = Takeout.splitIntoChunks(clips.map(clip => clip.path));
    // This is where the meat of the work happens. While we could schedule all
    // promises at once to concurrently execute, the whole idea is not to overload
    // the server. So do the expensive work on each chunk sequentially.
    // const replies = await Promise.all(chunkedKeys
    //   .map((keys, offset) => bucket.zipTakeoutFilesToS3(takeout, offset, keys)));
    const fileSizes: {size: number}[] = [];

    for (const [index, chunk] of chunkedClips.entries()) {
      fileSizes.push(
        await this.bucket.zipTakeoutFilesToS3(takeout, index, chunk)
      );
      await job.progress(Math.ceil((100 * index) / chunkedClips.length));
    }

    fileSizes.push(await this.bucket.uploadClipMetadata(takeout, clips));
    const totalSize = fileSizes.reduce(
      (acc, curr) => (acc += curr.size),
      0
    );

    await this.finalizeTakeout(
      takeout_id,
      clips.length,
      totalSize,
      chunkedClips.length
    );
    // TODO: send email.
  }

  async takeoutCleanupWorker(job: Job<{}>) {
    console.log('Running takeout cleanup worker');

    // Delete expired (or close to expiration) takeouts.
    const expired_deleted = await this.deleteCloseToExpirationTakeouts();
    if (expired_deleted)
      console.log(`deleted ${expired_deleted} expired takeouts`);

    // Delete takeouts that take way too long.
    const stuck_deleted = await this.deleteStuckTakeouts();
    if (stuck_deleted)
      console.log(
        `deleted ${stuck_deleted} stuck takeouts; you might want to investigate`
      );
  }

  async getClientTakeouts(client_id: string): Promise<TakeoutRequest[]> {
    const [takeouts] = (await this.db.query(
      `
      SELECT * FROM user_client_takeouts
      WHERE client_id = ? AND (expiration_date IS NULL OR NOW() < expiration_date) 
      ORDER BY requested_date DESC
    `,
      [client_id]
    )) as [TakeoutRequest[]];
    return takeouts;
  }

  async getTakeout(takeout_id: number): Promise<TakeoutRequest | null> {
    const [takeouts] = (await this.db.query(
      `
      SELECT * FROM user_client_takeouts
      WHERE id = ?
      LIMIT 1
    `,
      [takeout_id]
    )) as [TakeoutRequest[]];
    return takeouts[0] || null;
  }

  private async deleteTakeoutFiles(takeouts: TakeoutRequest[]) {
    takeouts.forEach(async takeout => {
      for (let i = 0; i < takeout.archive_count; i++) {
        await this.bucket.deletePath(this.bucket.takeoutKey(takeout, i));
      }
      await this.bucket.deletePath(this.bucket.metadataKey(takeout));
    });
    console.log(
      `deleted s3 files for the following takeout ids: ${takeouts
        .map(takeout => takeout.id)
        .join(',')}`
    );
  }

  private async deleteCloseToExpirationTakeouts() {
    const [expiredTakeouts] = (await this.db.query(
      `
        SELECT * FROM user_client_takeouts
        WHERE expiration_date IS NOT NULL
          AND state != ?
          AND DATE_SUB(expiration_date, INTERVAL ? HOUR) < NOW()
      `,
      [TakeoutState.EXPIRED, kExpirationMarginHours]
    )) as [TakeoutRequest[]];

    if (expiredTakeouts.length) await this.deleteTakeoutFiles(expiredTakeouts);

    return (
      await this.db.query(
        `
          UPDATE user_client_takeouts
          SET state = ?
          WHERE id IN (?)
        `,
        [TakeoutState.EXPIRED, expiredTakeouts.map(takeout => takeout.id)]
      )
    )[0].affectedRows;
  }

  private async deleteStuckTakeouts() {
    const [stuckTakeouts] = (await this.db.query(
      `
        SELECT * FROM user_client_takeouts
        WHERE state IN (?)
          AND DATE_ADD(requested_date, INTERVAL ? HOUR) < NOW()
      `,
      [[TakeoutState.PENDING, TakeoutState.IN_PROGRESS], kStuckDurationHours]
    )) as [TakeoutRequest[]];

    if (stuckTakeouts.length) await this.deleteTakeoutFiles(stuckTakeouts);

    // Requests that are still PENDING or IN_PROGRESS and did not complete within
    // kStuckDurationHours are deleted.
    return (
      await this.db.query(
        `
          UPDATE user_client_takeouts
          SET state = ?
          WHERE id IN (?)
        `,
        [TakeoutState.INCOMPLETE, stuckTakeouts.map(takeout => takeout.id)]
      )
    )[0].affectedRows;
  }

  private async insertNewTakeout(client_id: string): Promise<number> {
    if (!(await this.clientCanRequestTakeout(client_id)))
      throw new Error('pending takeout');
    const [q] = await this.db.query(
      `
      INSERT INTO user_client_takeouts (client_id, state, requested_date)
      VALUES (?, ?, NOW())
    `,
      [client_id, TakeoutState.PENDING]
    );
    return q.insertId;
  }

  /**
   * Returns whether a client can start a new takeout, which is only true when
   * there is no in-progress takeout already.
   */
  private async clientCanRequestTakeout(client_id: string): Promise<boolean> {
    const [pending] = await this.db.query(
      `
      SELECT 1 FROM user_client_takeouts
      WHERE client_id = ? AND state IN (?)
      LIMIT 1
    `,
      [client_id, [TakeoutState.PENDING, TakeoutState.IN_PROGRESS]]
    );
    return pending.length === 0;
  }

  private async finalizeTakeout(
    takeout_id: number,
    clip_count: number,
    clip_total_size: number,
    archive_count: number
  ) {
    console.log('finalizing takeout', takeout_id);
    return await this.db.query(
      `
      UPDATE user_client_takeouts 
      SET 
        state = ?, 
        expiration_date = DATE_ADD(NOW(), INTERVAL ? DAY),
        clip_count = ?,
        clip_total_size = ?,
        archive_count = ?
      WHERE id = ?
    `,
      [
        TakeoutState.AVAILABLE,
        kExpirationDays,
        clip_count,
        clip_total_size,
        archive_count,
        takeout_id,
      ]
    );
  }

  private async markTakeoutInProgress(takeout_id: number) {
    return await this.db.query(
      `
      UPDATE user_client_takeouts
      SET state = ?
      WHERE id = ?
    `,
      [TakeoutState.IN_PROGRESS, takeout_id]
    );
  }

  private static splitIntoChunks(paths: string[]): string[][] {
    var result = [];

    for (let i = 0; i < paths.length; i += kChunkMaxFiles) {
      result.push(paths.slice(i, i + kChunkMaxFiles));
    }

    return result;
  }
}
