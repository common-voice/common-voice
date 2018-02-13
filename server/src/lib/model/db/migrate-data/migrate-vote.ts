import { VoteData } from './fetch-s3-data';

export async function migrateVote(pool: any, vote: VoteData, print: any) {
  const [[clip]] = await pool.query(
    'SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?',
    [vote.clip_client_id, vote.clip_sentence_id]
  );
  if (!(clip && vote.clip_client_id && vote.voter_client_id)) {
    return false;
  }

  try {
    await pool.query(
      `
        INSERT INTO votes (clip_id, client_id, is_valid) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)
      `,
      [clip.id, vote.voter_client_id, vote.is_valid ? 1 : 0]
    );
    return true;
  } catch (e) {
    print('vote insertion failed', e);
    throw e;
  }
}
