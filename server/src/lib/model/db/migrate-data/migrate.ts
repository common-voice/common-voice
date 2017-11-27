import { IConnection } from 'mysql2Types';
import { fetchS3Data } from './fetch-s3-data';
import { migrateClips } from './migrate-clips';
import { migrateSentences } from './migrate-sentences';

function print(...args: any[]) {
  args.unshift('MIGRATION --');
  console.log.apply(console, args);
}

export async function migrate(connection: IConnection) {
  const [[result]] = (await connection.query(
    'SELECT 1 FROM sentences LIMIT 1'
  )) as any;
  if (result) {
    return print('skipping');
  }

  print('starting');
  await connection.beginTransaction(err => console.error(err));

  const [s3Data] = await Promise.all([
    fetchS3Data(print),
    migrateSentences(connection, print),
  ]);
  await migrateClips(connection, s3Data.clips, print);

  await connection.commit(err => console.error(err));
}
