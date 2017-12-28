import { IConnection } from 'mysql2Types';
import { fetchS3Data } from './fetch-s3-data';
import { migrateClips } from './migrate-clips';
import { migrateSentences } from './migrate-sentences';
import { migrateVotes } from './migrate-votes';
import { migrateUserClients } from './migrate-user-clients';

function print(...args: any[]) {
  args.unshift('MIGRATION --');
  console.log.apply(console, args);
}

export async function migrate(connection: IConnection) {
  print('starting');
  try {
    const [s3Data] = await Promise.all([
      fetchS3Data(print),
      migrateSentences(connection, print),
    ]);
    await migrateUserClients(connection, s3Data.client_ids, print);
    await migrateClips(connection, s3Data.clips, print);
    await migrateVotes(connection, s3Data.votes, print);
    print('done!!!!!');
  } catch (e) {
    console.error(e);
    print('failed');
  }
}
