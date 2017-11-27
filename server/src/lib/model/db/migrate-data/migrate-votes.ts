import { IConnection } from 'mysql2Types';
import { VoteData } from './fetch-s3-data';

export async function migrateVotes(
  connection: IConnection,
  votes: VoteData[],
  sentences: any,
  print: any
) {
  const votesWithClips: any[] = [];
  const votesWithoutClips: VoteData[] = [];
  for (const vote of votes as VoteData[]) {
    const sentence = sentences[vote.clip_sentence_id];
    const [
      [row],
    ] = await connection.execute(
      'SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?',
      [vote.clip_client_id, sentence ? sentence.id : vote.clip_sentence_id]
    );
    if (row) {
      (vote as any).clip_id = row.id;
      votesWithClips.push(vote);
    } else {
      votesWithoutClips.push(vote);
    }
  }

  if (votesWithoutClips.length) {
    print(
      votesWithoutClips.length,
      'votes without known clips found. Those will NOT be migrated:',
      JSON.stringify(votesWithoutClips)
    );
  }

  const [{ affectedRows }] = await connection.execute(
    connection.format(
      'INSERT INTO votes (clip_id, client_id, is_valid) VALUES ? ' +
        'ON DUPLICATE KEY UPDATE id = id',
      [votesWithClips.map((v: any) => [v.clip_id, v.voter_client_id, true])]
    )
  );

  print(affectedRows, 'votes');
}
