import { IConnection } from 'mysql2Types';
import { fetchS3Data } from './fetch-s3-data';
import { migrateClip } from './migrate-clip';
import { migrateSentences } from './migrate-sentences';
import { migrateVote } from './migrate-vote';
import { migrateUserClient } from './migrate-user-client';

(Symbol as any).asyncIterator =
  Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');

function print(...args: any[]) {
  args.unshift('MIGRATION --');
  console.log.apply(console, args);
}

/**
 * Migrates all the data from S3 into the database
 * Most sentences are retrieved from disk (inside the data dir), but some might be missing and will be fetched from S3.
 * Initially that sentence migration happened first, to reduce the number of roundtrips. But since we don't get whether
 * the sentence is_used from S3, we have to migrate the sentences from S3 first, and then set the is_used flag based
 * on whether the sentence sits in the "not-used" dir or not.
 */
export async function migrate(connection: IConnection) {
  print('starting');

  try {
    const gen = fetchS3Data(print);

    const votesWithUnknownClips = [];
    let processedObjectsCount = 0;
    let result;
    while ((result = await gen.next()) && !result.done) {
      processedObjectsCount++;
      const { type } = result.value;
      switch (type) {
        case 'clip':
          const clip = result.value;
          await migrateUserClient(connection, clip.client_id);
          await migrateClip(connection, clip, print);
          break;

        case 'vote':
          const vote = result.value;
          await migrateUserClient(connection, vote.clip_client_id);
          await migrateUserClient(connection, vote.voter_client_id);
          if (!await migrateVote(connection, vote, print)) {
            votesWithUnknownClips.push(vote);
          }
          break;

        case 'user_client':
          const userClient = result.value;
          await migrateUserClient(connection, userClient.client_id, userClient);
          break;
      }

      if (processedObjectsCount % 100 == 0) {
        print('processed', processedObjectsCount, 'objects from S3');
      }
    }

    await migrateSentences(connection, print);

    const [[row]] = await connection.execute(
      'SELECT ' +
        '(SELECT COUNT(*) FROM sentences) AS sentencesCount,' +
        '(SELECT COUNT(*) FROM user_clients) AS userClientsCount,' +
        '(SELECT COUNT(*) FROM clips) AS clipsCount,' +
        '(SELECT COUNT(*) FROM votes) AS votesCount'
    );
    print(JSON.stringify(row));
    if (votesWithUnknownClips.length > 0) {
      print(
        votesWithUnknownClips.length,
        'votes with unknown clip. It will NOT be migrated:',
        JSON.stringify(votesWithUnknownClips)
      );
    }
    print('done!!!!!');
  } catch (e) {
    console.error(e);
    print('failed');
  }
}
