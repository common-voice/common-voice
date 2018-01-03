import { IConnection } from 'mysql2Types';
import { ClipData } from './fetch-s3-data';
import { getConfig } from '../../../../config-helper';
import { AWS } from '../../../aws';

const TIMESTEP = 1000;
const AWS_MAX_GET_CALLS_PER_TIMESTEP = 300;

function fetchSentenceFromS3(glob: string): Promise<string> {
  const key = glob + '.txt';
  return new Promise(
    (res: (sentence: string) => void, rej: (error: any) => void) => {
      const params = { Bucket: getConfig().BUCKET_NAME, Key: key };
      AWS.getS3().getObject(params, (err: any, s3Data: any) => {
        if (err) {
          console.error('Could not read from s3', key, err);
          rej(err);
          return;
        }

        let sentence = s3Data.Body.toString();
        res(sentence);
      });
    }
  );
}

let requestTimesInTimestep: number[] = [];

export async function migrateClip(
  connection: IConnection,
  clip: ClipData,
  print: any
) {
  const insertClip = (sentenceText: string) =>
    connection.execute(
      'INSERT INTO clips (client_id, original_sentence_id, path, sentence) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE id = id',
      [clip.client_id, clip.original_sentence_id, clip.path, sentenceText]
    );

  const [
    [sentence],
  ] = (await connection.query('SELECT * FROM sentences WHERE id = ?', [
    clip.original_sentence_id,
  ])) as any;

  if (sentence) {
    await insertClip(sentence.text);
    return;
  }

  const now = Date.now();
  requestTimesInTimestep = requestTimesInTimestep.filter(
    t => t > now - TIMESTEP
  );
  if (requestTimesInTimestep.length > AWS_MAX_GET_CALLS_PER_TIMESTEP) {
    await new Promise(resolve =>
      setTimeout(resolve, now - requestTimesInTimestep[0])
    );
  }

  try {
    const sentenceText = await fetchSentenceFromS3(
      clip.path.substr(0, clip.path.length - 4)
    );
    requestTimesInTimestep.push(now);

    if (sentenceText) {
      await connection.execute(
        'INSERT INTO sentences (id, text) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id',
        [clip.original_sentence_id, sentenceText]
      );
      await insertClip(sentenceText);
    }
  } catch (e) {
    print(
      'error while getting sentence',
      clip.original_sentence_id,
      'for clip',
      clip.path,
      ':',
      e
    );
  }
}
