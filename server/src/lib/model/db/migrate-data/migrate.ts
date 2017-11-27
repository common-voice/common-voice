import { IConnection } from 'mysql2Types';
const utf8 = require('utf8');
import { fetchS3Data } from './fetch-s3-data';
import { migrateClips } from './migrate-clips';
import { migrateSentences } from './migrate-sentences';
import { migrateVotes } from './migrate-votes';
import { hash } from '../../../clip';

function print(...args: any[]) {
  args.unshift('MIGRATION --');
  console.log.apply(console, args);
}

interface SentenceMap {
  [id: string]: any;
}

async function buildSentenceMapWithDiverseIndexes(
  connection: IConnection
): Promise<SentenceMap> {
  const [sentenceRows] = (await connection.query(
    'SELECT id, text FROM sentences'
  )) as any;

  const sentences: SentenceMap = {};
  for (const row of sentenceRows) {
    sentences[row.id] = row;
    sentences[hash(row.text.trim())] = row;
    sentences[hash(utf8.decode(row.text))] = row;
    sentences[
      hash(
        row.text.replace(/([?;,/:@&=+$])/g, (s: string) =>
          encodeURIComponent(s)
        )
      )
    ] = row;
  }
  return sentences;
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

  const [s3Data, sentences] = await Promise.all([
    fetchS3Data(print),
    migrateSentences(connection, print).then(() =>
      buildSentenceMapWithDiverseIndexes(connection)
    ),
  ]);
  await migrateClips(connection, s3Data.clips, sentences, print);
  await migrateVotes(connection, s3Data.votes, sentences, print);

  await connection.commit(err => console.error(err));
  print('done');
}
