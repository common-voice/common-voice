import { IConnection } from 'mysql2Types';
import { ClipData } from './fetch-s3-data';

export async function migrateClips(
  connection: IConnection,
  clips: ClipData[],
  sentences: any,
  print: any
) {
  const [
    userClientRows,
  ] = (await connection.query(
    'SELECT client_id FROM user_clients WHERE client_id IN (?)',
    [clips.map(c => c.client_id)]
  )) as any;

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
