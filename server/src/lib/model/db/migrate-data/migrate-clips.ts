import { IConnection } from 'mysql2Types';
const utf8 = require('utf8');
import { ClipData } from './fetch-s3-data';
import { hash } from '../../../clip';

export async function migrateClips(
  connection: IConnection,
  clips: ClipData[],
  print: any
) {
  const [[sentenceRows], [userClientRows]] = (await Promise.all([
    connection.query('SELECT id, text FROM sentences'),
    connection.query(
      connection.format(
        'SELECT client_id FROM user_clients WHERE client_id IN (?)',
        [clips.map(c => c.client_id)]
      )
    ),
  ])) as any;

  const sentences: { [id: string]: any } = {};
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

  const userClients: { [id: string]: boolean } = {};
  for (const row of userClientRows) {
    userClients[row.client_id] = true;
  }

  const clipsWithSentences: any[] = [];
  const clipsWithoutSentences: any[] = [];
  for (const clip of clips) {
    (sentences[clip.original_sentence_id]
      ? clipsWithSentences
      : clipsWithoutSentences
    ).push(clip);
  }

  if (clipsWithoutSentences.length) {
    print(
      clipsWithoutSentences.length,
      'clips without known sentences found. Those will NOT be migrated:',
      JSON.stringify(clipsWithoutSentences)
    );
  }

  const [{ affectedRows }] = await connection.execute(
    connection.format(
      'INSERT INTO clips (client_id, original_sentence_id, path, sentence) VALUES ?',
      [
        clipsWithSentences.map(c => {
          const sentence = sentences[c.original_sentence_id];
          return [
            userClients[c.client_id] ? c.client_id : null,
            sentence.id,
            c.path,
            sentence.text,
          ];
        }),
      ]
    )
  );

  print(affectedRows, 'clips');
}
