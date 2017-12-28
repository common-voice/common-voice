import { IConnection } from 'mysql2Types';

export async function migrateUserClient(
  connection: IConnection,
  client_id: string
) {
  await connection.execute(
    'INSERT INTO user_clients (client_id) VALUES (?) ON DUPLICATE KEY UPDATE client_id = client_id',
    [client_id]
  );
}
