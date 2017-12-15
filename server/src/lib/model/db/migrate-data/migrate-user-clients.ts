import { IConnection } from 'mysql2Types';

export async function migrateUserClients(
  connection: IConnection,
  client_ids: string[],
  print: any
) {
  await connection.execute(
    connection.format(
      'INSERT INTO user_clients (client_id) VALUES ? ON DUPLICATE KEY UPDATE client_id = client_id',
      [client_ids.filter(Boolean).map(id => [id])]
    )
  );
  const [[{ count }]] = (await connection.query(
    'SELECT COUNT(*) AS count FROM user_clients'
  )) as any;

  print(count, 'user_clients');
}
