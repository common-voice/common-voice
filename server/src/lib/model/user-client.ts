import pick = require('lodash.pick');
import { UserClient } from 'common/user-clients';
import Awards from './awards';
import CustomGoal from './custom-goal';
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
        WHERE (u.client_id = ? OR email = ?) AND !has_login
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

  async findAccount(email: string): Promise<UserClient> {
    const [rows] = await db.query(
      `
        SELECT DISTINCT
          u.*,
          accents.accent,
          locales.name AS locale,
          (SELECT COUNT(*) FROM clips WHERE u.client_id = clips.client_id) AS clips_count,
          (SELECT COUNT(*) FROM votes WHERE u.client_id = votes.client_id) AS votes_count,
          t.name AS team
        FROM user_clients u
        LEFT JOIN user_client_accents accents on u.client_id = accents.client_id
        LEFT JOIN locales on accents.locale_id = locales.id
        LEFT JOIN (SELECT enroll.client_id, teams.name FROM enroll LEFT JOIN teams ON enroll.team_id = teams.id) t ON t.client_id = u.client_id
        WHERE u.email = ? AND has_login
        GROUP BY u.client_id, accents.id
        ORDER BY accents.id ASC
      `,
      [email]
    );

    const clientId = rows[0] ? rows[0].client_id : null;
    const [custom_goals, awards]: any = clientId
      ? await Promise.all([CustomGoal.find(clientId), Awards.find(clientId)])
      : [[], []];
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
              'visible',
              'avatar_url',
              'avatar_clip_url',
              'clips_count',
              'votes_count'
            ),
            locales: client.locales.concat(
              typeof row.accent == 'string'
                ? { accent: row.accent, locale: row.locale }
                : []
            ),
            awards,
            custom_goals,
            enroll: { team: row.team },
          }),
          { locales: [] }
        );
  },

  async saveAccount(
    email: string,
    { client_id, locales, ...data }: UserClient
  ): Promise<UserClient> {
    let [accountClientId, [clients]] = await Promise.all([
      UserClient.findClientId(email),
      email
        ? db.query(
            'SELECT client_id FROM user_clients WHERE email = ? AND !has_login',
            [email]
          )
        : [],
    ]);

    if (!accountClientId) {
      accountClientId = client_id;
    }
    const clientIds = clients.map((c: any) => c.client_id).concat(client_id);

    const userData = await Promise.all(
      Object.entries({
        has_login: true,
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
      this.claimContributions(accountClientId, clientIds),
      locales && updateLocales(accountClientId, locales),
      this.enrollRegisteredUser(
        email,
        data.enroll.team,
        data.enroll.challenge,
        data.enroll.invite
      ),
    ]);

    return UserClient.findAccount(email);
  },

  async save({ client_id, email, age, gender }: any): Promise<boolean> {
    const [[row]] = await db.query(
      'SELECT has_login FROM user_clients WHERE client_id = ?',
      [client_id]
    );

    if (row && row.has_login) return false;

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

  async updateSSO(old_email: string, email: string): Promise<boolean> {
    const [[row]] = await db.query(
      'SELECT 1 FROM user_clients WHERE email = ? AND has_login',
      [email]
    );

    if (row) {
      return false;
    }

    await db.query(
      'UPDATE user_clients SET email = ? WHERE email = ? AND has_login',
      [email, old_email]
    );
    return true;
  },

  // enroll an unenrolled but registered user
  // [BUG]: there are exceptions if the team or challenge doesn't exist
  // TODO(riley): Hook this up to a constants file.
  async enrollRegisteredUser(
    email: string,
    team_name: string,
    challenge_id: number,
    team_url_token: string
  ): Promise<boolean> {
    if (email && team_name && challenge_id && team_url_token) {
      let client_id = await Promise.all([UserClient.findClientId(email)]);
      if (client_id) {
        const res = await db.query(
          `INSERT IGNORE INTO enroll (id, challenge_id, url_token, client_id, team_id)
           VALUES (null, ?, ?, ?, (SELECT id FROM teams WHERE challenge_id=? AND name=? AND url_token=?))`,
          [
            challenge_id,
            team_url_token,
            client_id,
            challenge_id,
            team_name,
            team_url_token,
          ]
        );
        return res && res[0] && res[0].affectedRows > 1;
      }
    }
    return false;
  },

  async updateAvatarURL(email: string, url: string) {
    await db.query('UPDATE user_clients SET avatar_url = ? WHERE email = ?', [
      url,
      email,
    ]);
  },

  async updateAvatarClipURL(email: string, url: string) {
    await db.query(
      'UPDATE user_clients SET avatar_clip_url = ? WHERE email = ?',
      [url, email]
    );
  },

  async getAvatarClipURL(email: string) {
    return await db.query(
      'SELECT avatar_clip_url FROM user_clients WHERE email = ?',
      [email]
    );
  },

  async deleteAvatarClipURL(email: string) {
    await db.query(
      'UPDATE user_clients SET avatar_clip_url = NULL WHERE email = ?',
      [email]
    );
  },

  async findClientId(email: string): Promise<null | string> {
    const [[row]] = await db.query(
      'SELECT client_id FROM user_clients WHERE email = ? AND has_login',
      [email]
    );
    return row ? row.client_id : null;
  },

  async hasSSO(client_id: string): Promise<boolean> {
    return Boolean(
      (await db.query(
        'SELECT 1 FROM user_clients WHERE client_id = ? AND has_login',
        [client_id]
      ))[0][0]
    );
  },

  async claimContributions(to: string, from: string[]) {
    await Promise.all([
      db.query('UPDATE IGNORE clips SET client_id = ? WHERE client_id IN (?)', [
        to,
        from,
      ]),
      db.query('UPDATE IGNORE votes SET client_id = ? WHERE client_id IN (?)', [
        to,
        from,
      ]),
    ]);
  },
};

export default UserClient;
