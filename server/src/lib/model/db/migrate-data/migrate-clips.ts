import { IConnection } from 'mysql2Types';
import { ClipData } from './fetch-s3-data';
import { getConfig } from '../../../../config-helper';
import { AWS } from '../../../aws';

const AWS_MAX_GET_CALLS_PER_SEC = 800;

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

export async function migrateClips(
  connection: IConnection,
  clips: ClipData[],
  sentences: any,
  print: any
) {
  const completeClips: any[] = [];
  const clipsWithoutSentences: any[] = [];
  let awsRequestCount = 0;
  for (const clip of clips) {
    if (sentences[clip.original_sentence_id]) {
      completeClips.push(clip);
      continue;
    }

    if (
      awsRequestCount != 0 &&
      awsRequestCount % AWS_MAX_GET_CALLS_PER_SEC == 0
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const sentenceText = await fetchSentenceFromS3(
      clip.path.substr(0, clip.path.length - 4)
    );
    awsRequestCount++;

    if (sentenceText) {
      await connection.execute(
        'INSERT INTO sentences (id, text) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id',
        [clip.original_sentence_id, sentenceText]
      );
      sentences[clip.original_sentence_id] = sentenceText;
      completeClips.push(clip);
    } else {
      clipsWithoutSentences.push(clip);
    }
  }
  if (awsRequestCount) print('fetched', awsRequestCount, 'sentences from S3');

  if (clipsWithoutSentences.length) {
    print(
      clipsWithoutSentences.length,
      'clips with unknown sentences found. Those will NOT be migrated:',
      JSON.stringify(clipsWithoutSentences)
    );
  }

  try {
    await Promise.all(
      completeClips.map(c => {
        const sentence = sentences[c.original_sentence_id];
        if (!sentence || !sentence.id) return;
        return connection.execute(
          'INSERT INTO clips (client_id, original_sentence_id, path, sentence) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE id = id',
          [c.client_id, sentence.id, c.path, sentence.text]
        );
      })
    );

    const [[{ count }]] = (await connection.query(
      'SELECT COUNT(*) AS count FROM clips'
    )) as any;

    print(count, 'clips');
  } catch (e) {
    print('clips failed');
    throw e;
  }
}
