import pick = require('lodash.pick');
import { UserClient as UserClientType } from 'common';
import Awards from './awards';
import CustomGoal from './custom-goal';
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';
import { earnBonus } from './achievements';
import {
  ChallengeToken,
  ChallengeTeamToken,
  challengeTokens,
  challengeTeamTokens,
  AccentLocale,
} from 'common';

const db = getMySQLInstance();

async function updateLocales(clientId: string, locales: AccentLocale[]) {
  // Get a list of all accents currently stored for this user
  const [savedLocales]: [
    { id: number; locale: string; accent: string }[]
  ] = await db.query(
    `
      SELECT id, (SELECT name FROM locales WHERE id = locale_id) AS locale, accent_id AS accent
      FROM user_client_accents
      WHERE client_id = ?
      ORDER BY id
    `,
    [clientId]
  );

  // Identify whether there are any entries in savedLocales that are the same as
  // a corresponding entry in the input locales array
  let startAt = savedLocales.findIndex((savedLocale, i) => {
    const locale = locales[i];
    return (
      !locale ||
      savedLocale.locale !== locale.locale ||
      savedLocale.accent !== locale.accent
    );
  });

  // If all language/accent stats are the same, check
  // whether there are new entries in the input locales array
  if (startAt == -1) {
    if (locales.length <= savedLocales.length) {
      return;
    }
    startAt = savedLocales.length;
  }

  // Of the entries in savedLocales that are not the same as the input locales array
  // delete the remainder from savedLocales to avoid polluting/duplicating data
  const deleteIds = savedLocales.slice(startAt).map(s => s.id);

  if (deleteIds.length > 0) {
    await db.query('DELETE FROM user_client_accents WHERE id IN (?)', [
      deleteIds,
    ]);
  }

  // @TODO - Jenny - do some basic text cleaning on user submitted accents - trim, lowercase,
  // look at dashes/underscores/etc

  // Of the entries in savedLocales that are not the same as the input locales array
  // create any accents that are newly user submitted
  const newAccents = await Promise.all(
    locales.slice(startAt).map(async l => {
      const localeId = await getLocaleId(l.locale);

      // If the given accent from the input locales array does not have an accent ID or is
      // identified as a showCustom value, then this is a new user submitted accent that needs
      // to be entered
      if (!l.accent_id && l.showCustom) {
        await db.query(
          `INSERT INTO accents (locale_id, accent_name, user_submitted, client_id) values (?, ?, ?, ?)`,
          [localeId, l.accent, true, clientId]
        );

        const [
          [newAccent],
        ] = await db.query(
          `SELECT id FROM accents WHERE locale_id = ? AND accent_name = ? AND user_submitted`,
          [localeId, l.accent]
        );

        l.accent_id = newAccent.id;
      }

      return [clientId, localeId, l.accent_id ? null : l.accent, l.accent_id];
    })
  );

  // Finally, insert the new accent values into the user_client_accents table
  if (newAccents.length > 0) {
    await db.query(
      'INSERT INTO user_client_accents (client_id, locale_id, accent_token, accent_id) VALUES ?',
      [newAccents]
    );
  }
}

async function updateDemographics(
  clientId: string,
  age: string,
  gender: string
) {
  // Null (unset) values are sent up as blank strings. Here we cast blank
  // strings to null so they're unambiguously unset and map to the expected
  // NULL id in our database.
  age = age || null;
  gender = gender || null;

  const ageId =
    age &&
    (
      await db.query(
        `
          SELECT id
            FROM ages
            WHERE age = ?
        `,
        [age]
      )
    )?.[0]?.[0]?.id;

  const genderId =
    gender &&
    (
      await db.query(
        `
          SELECT id
            FROM genders
            WHERE gender = ?
        `,
        [gender]
      )
    )?.[0]?.[0]?.id;

  await db.query(
    `
    INSERT INTO demographics (client_id, age_id, gender_id) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      updated_at = now()
  `,
    [clientId, ageId ?? null, genderId ?? null]
  );
}

const UserClient = {
  async findAllWithLocales({
    client_id = null,
    email = null,
  }: {
    client_id: string;
    email: string;
  }) {
    const [rows] = await db.query(
      `
        SELECT u.*, accents.id AS accent_id, accents.accent_name, accents.user_submitted, locales.name AS locale, ages.age, genders.gender
        FROM user_clients u
        LEFT JOIN user_client_accents user_accents ON u.client_id = user_accents.client_id
        LEFT JOIN accents ON user_accents.accent_id = accents.id
        LEFT JOIN locales on accents.locale_id = locales.id
        -- TODO: This subquery is VERY awkward, but safer until we simplify
        --       accent grouping.
        CROSS JOIN
          (SELECT demographics.age_id, demographics.gender_id
            FROM user_clients
            LEFT JOIN demographics ON user_clients.client_id = demographics.client_id
            WHERE user_clients.${
              client_id ? `client_id = "${client_id}"` : `email = "${email}"`
            }
              AND user_clients.has_login
            ORDER BY updated_at DESC
            LIMIT 1
          ) AS d
        LEFT JOIN ages on d.age_id = ages.id
        LEFT JOIN genders on d.gender_id = genders.id
        WHERE (u.client_id = ? OR email = ?) AND !has_login
      `,
      [client_id, email]
    );
    return Object.values(
      rows.reduce((obj: { [client_id: string]: any }, row: any) => {
        const client = obj[row.client_id];
        obj[row.client_id] = {
          ...pick(row, 'client_id', 'accent', 'age', 'gender'),
          locales: (client ? client.locales : []).concat(
            typeof row.accent_name == 'string'
              ? {
                  accent: row.accent_name,
                  locale: row.locale,
                  accent_id: row.accent_id,
                  showCustom: row.user_submitted,
                }
              : []
          ),
        };
        return obj;
      }, {})
    );
  },

  async findAccount(email: string): Promise<UserClientType> {
    // @TOOD: this would be better split out into a few smaller queries than one giant query, surely???
    const [rows] = await db.query(
      `
        SELECT DISTINCT
          u.*,
          accents.id AS accent_id,
          accents.accent_name,
          accents.user_submitted,
          locales.name AS locale,
          ages.age,
          genders.gender,
          (SELECT COUNT(*) FROM clips WHERE u.client_id = clips.client_id) AS clips_count,
          (SELECT COUNT(*) FROM votes WHERE u.client_id = votes.client_id) AS votes_count,
          t.team,
          t.challenge,
          t.invite,
          n.basket_token AS basket_token
        FROM user_clients u
        LEFT JOIN user_client_newsletter_prefs n ON u.client_id = n.client_id
        LEFT JOIN user_client_accents user_accents ON u.client_id = user_accents.client_id
        LEFT JOIN accents ON user_accents.accent_id = accents.id
        LEFT JOIN locales ON accents.locale_id = locales.id

        -- TODO: This subquery is awkward, but safer until we simplify accent
        --       grouping.
        CROSS JOIN
          (SELECT demographics.age_id, demographics.gender_id
            FROM user_clients
            LEFT JOIN demographics ON user_clients.client_id = demographics.client_id
            WHERE user_clients.email = ?
              AND user_clients.has_login
            ORDER BY updated_at DESC
            LIMIT 1
          ) AS d
        LEFT JOIN ages ON d.age_id = ages.id
        LEFT JOIN genders ON d.gender_id = genders.id
        LEFT JOIN (
          SELECT enroll.client_id, enroll.url_token as invite, teams.url_token AS team, challenges.url_token AS challenge
          FROM enroll
          LEFT JOIN challenges ON enroll.challenge_id = challenges.id
          LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
        ) t ON t.client_id = u.client_id
        WHERE u.email = ? AND has_login
        GROUP BY u.client_id, user_accents.id
        ORDER BY user_accents.id ASC
      `,
      [email, email]
    );

    const clientId = rows[0] ? rows[0].client_id : null;
    const [custom_goals, awards]: any = clientId
      ? await Promise.all([CustomGoal.find(clientId), Awards.find(clientId)])
      : [[], []];
    return rows.length == 0
      ? null
      : rows.reduce(
          (client: UserClientType, row: any) => ({
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
              typeof row.accent_name == 'string'
                ? {
                    accent: row.accent_name,
                    locale: row.locale,
                    accent_id: row.accent_id,
                    showCustom: row.user_submitted,
                  }
                : []
            ),
            awards,
            custom_goals,
            enrollment: {
              team: row.team,
              challenge: row.challenge,
              invite: row.invite,
            },
          }),
          { locales: [] }
        );
  },

  async saveAccount(
    email: string,
    { client_id, locales, ...data }: UserClientType
  ): Promise<UserClientType> {
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
        ...pick(data, 'username', 'skip_submission_feedback', 'visible'),
      }).map(async ([key, value]) => key + ' = ' + (await db.escape(value)))
    );
    await db.query(
      `
        UPDATE user_clients
        SET ${userData.join(', ')}
        WHERE client_id = '${accountClientId}'
      `
    );
    // the accountClientId can't be a placeholder value otherwise it'll
    // treat any ? in the username or email as a placeholder also and the query will break
    const updateDemographicsPromise = updateDemographics(accountClientId, data.age, data.gender);
    await Promise.all([
      updateDemographicsPromise,
      this.claimContributions(accountClientId, clientIds),
      locales && updateLocales(accountClientId, locales),
    ]);

    if (
      data?.enrollment &&
      (await this.enrollRegisteredUser(
        email,
        data.enrollment.challenge,
        data.enrollment.team,
        data.enrollment.invite,
        data.enrollment.referer
      ))
    ) {
      await earnBonus('sign_up_first_three_days', [
        data.enrollment.challenge,
        client_id,
      ]);
      await earnBonus('invite_signup', [
        client_id,
        data.enrollment.invite,
        data.enrollment.invite,
        data.enrollment.challenge,
      ]);
    }
    return UserClient.findAccount(email);
  },

  async updateBasketToken(email: string, basketToken: string) {
    const client_id = await this.findClientId(email);
    if (client_id) {
      await db.query(
        `
          INSERT INTO user_client_newsletter_prefs (client_id, email, basket_token, last_active)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE basket_token = basket_token`,
        [client_id, email, basketToken]
      );
      return client_id;
    }
  },

  async updateSSO(old_email: string, email: string): Promise<boolean> {
    const [
      [row],
    ] = await db.query(
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

    await db.query(
      'UPDATE user_client_newsletter_prefs SET email = ? WHERE email = ?',
      [email, old_email]
    );

    return true;
  },

  // enroll an unenrolled but registered user
  async enrollRegisteredUser(
    email: string,
    challenge: ChallengeToken,
    team: ChallengeTeamToken,
    invite?: string,
    referer?: string
  ): Promise<boolean> {
    if (
      email &&
      challengeTokens.includes(challenge) &&
      challengeTeamTokens.includes(team)
    ) {
      // For registered user, client_id is not null
      // For enrolled user, enroll_id is not null
      // For user enrolled in the challenge, challenge_id is not null
      const [registeredUser] = await db.query(
        `
        SELECT user_clients.client_id, enroll.id AS enroll_id, challenges.id AS challenge_id
        FROM user_clients
        LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
        LEFT JOIN challenges ON enroll.challenge_id = challenges.id AND challenges.url_token = ?
        WHERE user_clients.email = ?
        AND user_clients.has_login
        `,
        [challenge, email]
      );
      // only proceed to enroll a registered but not enrolled in the challenge
      const proceed =
        registeredUser.length > 0 &&
        registeredUser.every(
          (u: { client_id: string; enroll_id: number; challenge_id: number }) =>
            u.client_id != null &&
            (u.enroll_id == null || u.challenge_id == null)
        );

      if (proceed) {
        // If signing up through a user invitation URL, `invited_by` is the
        // `url_token` from another row. Otherwise, `invited_by` is null.
        // [FUTURE] UUID is too long, maybe consider to optimize it by removing '-' and base64 encoding it.
        // [FUTURE] check if `team` is enrolled in `challenge`.
        const [[{ team_id, challenge_id, enrollment_token }]] = await db.query(
          `SELECT t.id AS team_id, t.challenge_id, UUID() AS enrollment_token FROM teams t
            LEFT JOIN challenges c ON t.challenge_id = c.id
            WHERE t.url_token=? AND c.url_token = ?`,
          [team, challenge]
        );

        // INSERT IGNORE will hide exceptions such as duplicate foreign key violation
        // It is sort of catch exception but do nothing, not even log to console.
        const res = await db.query(
          `
          INSERT INTO enroll (challenge_id, team_id, client_id, url_token, invited_by, referer) VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            challenge_id,
            team_id,
            registeredUser[0].client_id,
            enrollment_token,
            invite || null,
            referer || null,
          ]
        );
        return res?.[0]?.affectedRows > 0;
      }
    }
    return false;
  },

  /**
   * Update avatar for user and return original value
   */

  async updateAvatarURL(email: string, url: string) {
    const [
      [origAvatar],
    ] = await db.query('SELECT avatar_url FROM user_clients WHERE email = ?', [
      email,
    ]);

    await db.query('UPDATE user_clients SET avatar_url = ? WHERE email = ?', [
      url,
      email,
    ]);

    return origAvatar.avatar_url;
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
    const [
      [row],
    ] = await db.query(
      'SELECT client_id FROM user_clients WHERE email = ? AND has_login',
      [email]
    );
    return row ? row.client_id : null;
  },

  async hasSSO(client_id: string): Promise<boolean> {
    return Boolean(
      (
        await db.query(
          'SELECT 1 FROM user_clients WHERE client_id = ? AND has_login',
          [client_id]
        )
      )[0][0]
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
