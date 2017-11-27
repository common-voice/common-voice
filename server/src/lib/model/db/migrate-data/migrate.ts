import { IConnection } from 'mysql2Types';
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
  const sentencesCount = await migrateSentences(connection);
  print(sentencesCount, 'sentences');
  await connection.commit(err => console.error(err));
}
