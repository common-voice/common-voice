import pick = require('lodash.pick');
import { UserClient } from '../../../../common/user-clients';
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

const UserClient = {
  async findAllWithLocales({
    client_id,
    email,
  }: {
    client_id: string;
    email: string;
  }) {
    const [rows] = await db.query(
      `
        SELECT u.*, accents.accent, locales.name AS locale
        FROM user_clients u
        LEFT JOIN user_client_accents accents on u.client_id = accents.client_id
        LEFT JOIN locales on accents.locale_id = locales.id
        WHERE u.client_id = ? OR email = ?
      `,
      [client_id || null, email || null]
    );
    return Object.values(
      rows.reduce((obj: { [client_id: string]: any }, row: any) => {
        const client = obj[row.client_id];
        obj[row.client_id] = {
          ...pick(row, 'client_id', 'accent', 'age', 'gender'),
          locales: (client ? client.locales : []).concat(
            row.accent ? { accent: row.accent, locale: row.locale } : []
          ),
        };
        return obj;
      }, {})
    );
  },

  async findAccount(sso_id: string): Promise<UserClient> {
    const [rows] = await db.query(
      `
        SELECT u.*, accents.accent, locales.name AS locale
        FROM user_clients u
        LEFT JOIN user_client_accents accents on u.client_id = accents.client_id
        LEFT JOIN locales on accents.locale_id = locales.id
        WHERE u.sso_id = ?
      `,
      [sso_id]
    );

    return rows.length == 0
      ? null
      : rows.reduce(
          (client: UserClient, row: any) => ({
            ...pick(row, 'accent', 'age', 'gender', 'username'),
            locales: client.locales.concat(
              row.accent ? { accent: row.accent, locale: row.locale } : []
            ),
          }),
          { locales: [] }
        );
  },

  async saveAccount(
    sso_id: string,
    { client_id, email, ...data }: UserClient
  ): Promise<UserClient> {
    const [[[account]], [clients]] = await Promise.all([
      db.query('SELECT client_id FROM user_clients WHERE sso_id = ?', [sso_id]),
      db.query('SELECT client_id FROM user_clients WHERE email = ?', [email]),
    ]);

    const accountClientId = account ? account.client_id : client_id;
    const clientIds = clients.map((c: any) => c.client_id).concat(client_id);

    await db.query(
      `
        UPDATE user_clients
        SET age = :age, gender = :gender, username = :username, sso_id = :sso_id, email = :email
        WHERE client_id = :client_id
      `,
      {
        client_id: accountClientId,
        sso_id,
        email,
        ...pick(data, 'age', 'gender', 'username'),
      }
    );
    await db.query(
      'UPDATE IGNORE clips SET client_id = ? WHERE client_id IN (?)',
      [accountClientId, clientIds]
    );
    await db.query(
      'UPDATE IGNORE votes SET client_id = ? WHERE client_id IN (?)',
      [accountClientId, clientIds]
    );

    return UserClient.findAccount(sso_id);
  },

  async save({ client_id, email, age, gender }: any): Promise<boolean> {
    const [[row]] = await db.query(
      'SELECT sso_id FROM user_clients WHERE client_id = ?',
      [client_id]
    );

    if (row && row.sso_id) return false;

    if (row) {
      await db.query(
        `
        UPDATE user_clients SET email  = ?, age  = ?, gender = ? WHERE client_id = ?
      `,
        [email, age, gender, client_id]
      );
    } else {
      await db.query(
        `
        INSERT INTO user_clients (client_id, email, age, gender) VALUES (?, ?, ?, ?)
      `,
        [client_id, email, age, gender]
      );
    }
  },
};

export default UserClient;
