import { IConnection } from 'mysql2Types';
import { ClipData } from './fetch-s3-data';

export async function migrateClips(
  connection: IConnection,
  clips: ClipData[],
  sentences: any,
  print: any
) {
  const completeClips: any[] = [];
  const clipsWithUnknowns: any[] = [];
  for (const clip of clips) {
    (sentences[clip.original_sentence_id] && clip.client_id
      ? completeClips
      : clipsWithUnknowns
    ).push(clip);
  }

  if (clipsWithUnknowns.length) {
    print(
      clipsWithUnknowns.length,
      'clips with unknown foreign keys found. Those will NOT be migrated:',
      JSON.stringify(clipsWithUnknowns)
    );
  }

  try {
    await Promise.all(
      completeClips.map(c => {
        const sentence = sentences[c.original_sentence_id];
        return connection.execute(
          'INSERT INTO clips (client_id, original_sentence_id, path, sentence) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE id = id',
          [c.client_id, sentence.id, c.path, sentence.text]
        );
      })
    );

    print(completeClips.length, 'clips');
  } catch (e) {
    print('clips failed');
    throw e;
  }
}
