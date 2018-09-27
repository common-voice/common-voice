import pick = require('lodash.pick');
import { UserClient } from '../../../../common/user-clients';
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

async function updateLocales(
  clientId: string,
  locales: { locale: string; accent: string }[]
) {
  const [savedLocales]: [
    { id: number; locale: string; accent: string }[]
  ] = await db.query(
    `
      SELECT id, (SELECT name FROM locales WHERE id = locale_id) AS locale, accent
      FROM user_client_accents
      WHERE client_id = ?
      ORDER BY id
    `,
    [clientId]
  );

  let startAt = savedLocales.findIndex((savedLocale, i) => {
    const locale = locales[i];
    return (
      !locale ||
      savedLocale.locale !== locale.locale ||
      savedLocale.accent !== locale.accent
    );
  });
  if (startAt == -1) {
    if (locales.length <= savedLocales.length) {
      return;
    }
    startAt = savedLocales.length;
  }

  const deleteIds = savedLocales.slice(startAt).map(s => s.id);
  if (deleteIds.length > 0) {
    await db.query('DELETE FROM user_client_accents WHERE id IN (?)', [
      deleteIds,
    ]);
  }

  const newAccents = await Promise.all(
    locales
      .slice(startAt)
      .map(async l => [clientId, await getLocaleId(l.locale), l.accent])
  );
  if (newAccents.length > 0) {
    await db.query(
      'INSERT INTO user_client_accents (client_id, locale_id, accent) VALUES ?',
      [newAccents]
    );
  }
}

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
        WHERE (u.client_id = ? OR email = ?) AND sso_id IS NULL
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
        SELECT DISTINCT u.*, accents.accent, locales.name AS locale
        FROM user_clients u
        LEFT JOIN user_client_accents accents on u.client_id = accents.client_id
        LEFT JOIN locales on accents.locale_id = locales.id
        WHERE u.sso_id = ?
        ORDER BY accents.id ASC
      `,
      [sso_id]
    );

    return rows.length == 0
      ? null
      : rows.reduce(
          (client: UserClient, row: any) => ({
            ...pick(
              row,
              'accent',
              'age',
              'email',
              'gender',
              'username',
              'basket_token',
              'skip_submission_feedback',
              'visible'
            ),
            locales: client.locales.concat(
              typeof row.accent == 'string'
                ? { accent: row.accent, locale: row.locale }
                : []
            ),
          }),
          { locales: [] }
        );
  },

  async saveAccount(
    sso_id: string,
    { client_id, email, locales, ...data }: UserClient
  ): Promise<UserClient> {
    const [[[account]], [clients]] = await Promise.all([
      db.query('SELECT client_id FROM user_clients WHERE sso_id = ?', [sso_id]),
      email
        ? db.query('SELECT client_id FROM user_clients WHERE email = ?', [
            email,
          ])
        : [],
    ]);

    const accountClientId = account ? account.client_id : client_id;
    const clientIds = clients.map((c: any) => c.client_id).concat(client_id);

    const userData = await Promise.all(
      Object.entries({
        sso_id,
        email,
        ...pick(
          data,
          'age',
          'gender',
          'username',
          'skip_submission_feedback',
          'visible'
        ),
      }).map(async ([key, value]) => key + ' = ' + (await db.escape(value)))
    );
    await db.query(
      `
        UPDATE user_clients
        SET ${userData.join(', ')}
        WHERE client_id = ?
      `,
      [accountClientId]
    );

    await Promise.all([
      db.query('UPDATE IGNORE clips SET client_id = ? WHERE client_id IN (?)', [
        accountClientId,
        clientIds,
      ]),
      db.query('UPDATE IGNORE votes SET client_id = ? WHERE client_id IN (?)', [
        accountClientId,
        clientIds,
      ]),
      locales && updateLocales(accountClientId, locales),
    ]);

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

  async updateBasketToken(email: string, basketToken: string) {
    await db.query('UPDATE user_clients SET basket_token = ? WHERE email = ?', [
      basketToken,
      email,
    ]);
  },
};

export default UserClient;
