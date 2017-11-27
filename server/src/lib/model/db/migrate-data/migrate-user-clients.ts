import { IConnection } from 'mysql2Types';

export async function migrateUserClients(
  connection: IConnection,
  client_ids: string[],
  print: any
) {
  const [{ affectedRows }] = await connection.execute(
    connection.format(
      'INSERT INTO user_clients (client_id) VALUES ? ON DUPLICATE KEY UPDATE client_id = client_id',
      [client_ids.map(id => [id])]
    )
  );
  print(affectedRows, 'user_clients');
}
