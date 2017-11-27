import { IConnection } from 'mysql2Types';
import { VoteData } from './fetch-s3-data';

export async function migrateVotes(
  connection: IConnection,
  votes: VoteData[],
  print: any
) {
  const votesWithClips: any[] = [];
  const votesWithoutClips: VoteData[] = [];
  for (const vote of votes as VoteData[]) {
    const [
      [row],
    ] = await connection.execute(
      'SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?',
      [vote.clip_client_id, vote.clip_sentence_id]
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

  const [
    userClientRows,
  ] = (await connection.query(
    'SELECT client_id FROM user_clients WHERE client_id IN (?)',
    [votes.map(v => v.voter_client_id)]
  )) as any;
  const userClients: { [id: string]: boolean } = {};
  for (const row of userClientRows) {
    userClients[row.client_id] = true;
  }

  const [{ affectedRows }] = await connection.execute(
    connection.format(
      'INSERT INTO votes (clip_id, is_valid, client_id) VALUES ?',
      [
        votesWithClips.map((v: any) => [
          v.clip_id,
          true,
          userClients[v.voter_client_id] ? v.voter_client_id : null,
        ]),
      ]
    )
  );

  print(affectedRows, 'votes');
}
