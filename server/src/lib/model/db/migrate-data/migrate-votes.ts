import { IConnection } from 'mysql2Types';
import { VoteData } from './fetch-s3-data';

export async function migrateVotes(
  connection: IConnection,
  votes: VoteData[],
  print: any
) {
  const completeVotes: any[] = [];
  const votesWithUnknowns: VoteData[] = [];
  for (const vote of votes as VoteData[]) {
    const [
      [row],
    ] = await connection.execute(
      'SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?',
      [vote.clip_client_id, vote.clip_sentence_id]
    );
    if (row && vote.clip_client_id && vote.voter_client_id) {
      (vote as any).clip_id = row.id;
      completeVotes.push(vote);
    } else {
      votesWithUnknowns.push(vote);
    }
  }

  if (votesWithUnknowns.length) {
    print(
      votesWithUnknowns.length,
      'votes with unknown clips found. Those will NOT be migrated:',
      JSON.stringify(votesWithUnknowns)
    );
  }

  try {
    await Promise.all(
      completeVotes.map((v: any) =>
        connection.execute(
          'INSERT INTO votes (clip_id, client_id) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE id = id',
          [v.clip_id, v.voter_client_id]
        )
      )
    );

    const [[{ count }]] = (await connection.query(
      'SELECT COUNT(*) AS count FROM votes'
    )) as any;

    print(count, 'votes');
  } catch (e) {
    print('votes failed', e);
    throw e;
  }
}
