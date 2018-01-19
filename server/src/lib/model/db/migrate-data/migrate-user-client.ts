import { IConnection } from 'mysql2Types';
import { UserClientData } from './fetch-s3-data';

export async function migrateUserClient(
  connection: IConnection,
  client_id: string,
  data?: UserClientData
) {
  await (data
    ? connection.execute(
        `
        INSERT INTO user_clients (client_id, accent, age, gender) VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          accent = COALESCE(accent, VALUES(accent)),
          age = COALESCE(age, VALUES(age)),
          gender = COALESCE(gender, VALUES(gender))
      `,
        [client_id, data.accent || '', data.age || '', data.gender || '']
      )
    : connection.execute(
        'INSERT INTO user_clients (client_id) VALUES (?) ON DUPLICATE KEY UPDATE client_id = client_id',
        [client_id]
      ));
}
