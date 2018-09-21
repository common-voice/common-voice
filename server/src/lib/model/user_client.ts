import pick = require('lodash.pick');
import { UserClient } from '../../../../common/user-clients';
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

export default {
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
        const c = obj[row.client_id];
        obj[row.client_id] = {
          ...pick(row, 'client_id', 'accent', 'age', 'gender'),
          locales: (c ? c.locales : []).concat(
            row.accent ? { accent: row.accent, locale: row.locale } : []
          ),
        };
        return obj;
      }, {})
    );
  },

  async save(sso_id: string, { client_id, email, ...data }: UserClient) {
    const [[[account]], [clients]] = await Promise.all([
      db.query('SELECT client_id FROM user_clients WHERE sso_id = ?', [sso_id]),
      db.query(
        'SELECT client_id FROM user_clients WHERE client_id = ? OR email = ?',
        [client_id, email]
      ),
    ]);

    const accountClientId = account ? account.client_id : client_id;
    const clientIds = clients.map((c: any) => c.client_id);

    await db.query(
      `
        UPDATE user_clients
        SET age = :age, gender = :gender, username = :username, sso_id = :sso_id
        WHERE client_id = :client_id
      `,
      {
        client_id: accountClientId,
        sso_id,
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
  },
};
