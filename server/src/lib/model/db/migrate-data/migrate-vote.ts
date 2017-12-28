import { IConnection } from 'mysql2Types';
import { VoteData } from './fetch-s3-data';

export async function migrateVote(
  connection: IConnection,
  vote: VoteData,
  print: any
) {
  const [
    [clip],
  ] = await connection.execute(
    'SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?',
    [vote.clip_client_id, vote.clip_sentence_id]
  );
  if (!(clip && vote.clip_client_id && vote.voter_client_id)) {
    return false;
  }

  try {
    await connection.execute(
      'INSERT INTO votes (clip_id, client_id) VALUES (?, ?) ' +
        'ON DUPLICATE KEY UPDATE id = id',
      [clip.id, vote.voter_client_id]
    );
    return true;
  } catch (e) {
    print('vote insertion failed', e);
    throw e;
  }
}
