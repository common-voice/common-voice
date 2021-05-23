import Mysql from './model/db/mysql';
import Bucket from './bucket';
import { S3 } from 'aws-sdk';
import * as Bull from 'bull';
import { Job, Queue, QueueOptions } from 'bull';
import { getConfig } from '../config-helper';
import { TakeoutRequest, TakeoutState } from 'common';

// How many concurrent takeouts can take place at any time.
const kTakeoutConcurrency = 4;
// How many takeouts can take place per hour.
const kTakeoutRateLimiter: Bull.RateLimiter = { max: 4, duration: 3600 };
// Maximum amount of bytes each takeout archive file can contain. 10 MB.
const kChunkMaxSizeBytes = 10 * 1024 * 1024;
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
  const createQueue = <T>(name: string, params?: QueueOptions) =>
    new Bull<T>(name, {
      redis: getConfig().REDIS_URL,
      prefix: `bull-${name}-`,
      ...params,
    });

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

export default class Takeout {
  private readonly db: Mysql;
  private readonly s3: S3;
  private readonly bucket: Bucket;
  private queue: Bull.Queue<TakeoutTask>;

  constructor(db: Mysql, s3: S3, bucket: Bucket) {
    this.db = db;
    this.s3 = s3;
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
  ): Promise<string[]> {
    const takeout = await this.getTakeout(takeout_id);
    if (takeout === null) throw 'no such takeout';
    if (takeout.client_id !== client_id) throw 'no such takeout';
    if (takeout.state !== TakeoutState.AVAILABLE)
      throw 'takeout is unavailable';
    const keys = [...Array(takeout.archive_count).keys()].map(offset =>
      this.bucket.takeoutKey(takeout, offset)
    );
    return keys.map(key => this.bucket.getPublicUrl(key));
  }

  async takeoutWorker(job: Job<TakeoutTask>): Promise<void> {
    console.log('performing takeout', job.data);
    const takeout_id = job.data.takeout_id;
    const takeout = await this.getTakeout(takeout_id);
    if (takeout === null) throw 'unknown takeout';
    // IN_PROGRESS takeouts that failed will get cleaned up eventually.
    if (takeout.state !== TakeoutState.PENDING) throw 'illegal state';
    await this.markTakeoutInProgress(takeout_id);
    const clips = await this.bucket.getClientClips(takeout.client_id);
    const [chunkedClips, totalSize] = Takeout.splitIntoMaxSizedChunks(clips);
    // This is where the meat of the work happens. While we could schedule all
    // promises at once to concurrently execute, the whole idea is not to overload
    // the server. So do the expensive work on each chunk sequentially.
    // const replies = await Promise.all(chunkedKeys
    //   .map((keys, offset) => bucket.zipTakeoutFilesToS3(takeout, offset, keys)));
    const replies = [];
    for (const [offset, chunk] of chunkedClips.entries()) {
      replies.push(
        await this.bucket.zipTakeoutFilesToS3(takeout, offset, chunk)
      );
      await job.progress(Math.ceil((100 * offset) / chunkedClips.length));
    }
    await this.finalizeTakeout(
      takeout_id,
      clips.length,
      totalSize,
      chunkedClips.length
    );
    // TODO: send email.
  }

  async takeoutCleanupWorker(job: Job<{}>) {
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

  private async deleteCloseToExpirationTakeouts() {
    return (
      await this.db.query(
        `
      DELETE FROM user_client_takeouts
      WHERE expiration_date IS NOT NULL
        AND DATE_SUB(expiration_date, INTERVAL ? HOUR) < NOW()
    `,
        [kExpirationMarginHours]
      )
    )[0].affectedRows;
  }

  private async deleteStuckTakeouts() {
    // Requests that are still PENDING or IN_PROGRESS and did not complete within
    // kStuckDurationHours are deleted.
    return (
      await this.db.query(
        `
      DELETE FROM user_client_takeouts
      WHERE state != ?
        AND DATE_ADD(requested_date, INTERVAL ? HOUR) < NOW()
    `,
        [TakeoutState.AVAILABLE, kStuckDurationHours]
      )
    )[0].affectedRows;
  }

  private async insertNewTakeout(client_id: string): Promise<number> {
    if (!(await this.clientCanRequestTakeout(client_id)))
      throw 'pending takeout';
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
      WHERE client_id = ? AND state != ?
      LIMIT 1
    `,
      [client_id, TakeoutState.AVAILABLE]
    );
    return pending.length === 0;
  }

  private async finalizeTakeout(
    takeout_id: number,
    clip_count: number,
    clip_total_size: number,
    archive_count: number
  ) {
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

  private static splitIntoMaxSizedChunks(
    clips: S3.Object[]
  ): [string[][], number] {
    const todo = [...clips];
    const chunks = [];
    let totalSize = 0;
    do {
      const currentChunk = [];
      let size = 0;
      while (todo.length && size < kChunkMaxSizeBytes) {
        const clip = todo.pop();
        currentChunk.push(clip.Key);
        size += clip.Size;
      }
      chunks.push(currentChunk);
      totalSize += size;
    } while (todo.length);
    return [chunks, totalSize];
  }
}
