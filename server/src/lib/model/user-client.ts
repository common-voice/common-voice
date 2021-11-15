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
  UserAccentLocale,
  Accent
} from 'common';

const db = getMySQLInstance();


/*
 * due to the way accents are stored, the user retrieval queries returns
 * one full row per accent, and these need to be collated into an object
 */
const compileLocales = (clientLocales: any, row: any) => {
  const result = clientLocales || {};

  if (row.accent_id) {
    const accent = { name: row.accent_name, id: row.accent_id, token: row.accent_token };
    if (result[row.locale]) {
      result[row.locale].accents.push(accent);
    } else {
      result[row.locale] = {
        locale: row.locale,
        accents: [accent]
      }
    }
  }

  return result;
}

/*
 * while collating accents using compileLocales() it makes sense to refer to them as an object
 * everywhere else in the UI expects an array, and this is less disruptive than refactoring those mechanisms
 */
const reduceLocales = (userObj: any) => {
  return userObj?.locales ?
    {
      ...userObj,
      locales: Object.keys(userObj.locales).map((key: string) => userObj.locales[key])
    }
    : userObj;
}

const generateAccentToken = (accent: string) => {
  // Note: this is extremely rudimentary, because ECMA regex is inconsistent with
  // full unicode charset and may impact non-romance languages
  return accent.trim().toLowerCase().replace(/[\.,;\?\!'"]/g, '').replace(/[\s-_\(\)\[\]\<\>`]/g, '-').replace(/(-)(?=\1)/g, '-');
}

/**
 * Updates accent entries for a given user
 *
 * @param clientId clientId as string
 * @param locales array of UserAccentLocales
 * @returns an object with two params:
 *   localesToDelete: { id: number, accent_id: number }[] to represent entries that need to be deleted
 *   localesToUpdate: { locale: string, accent_name: string, accent_id: number } to represent entres
 *      that need to be added
 */
const getLocalesDelta = async (clientId: string, accentLocales: UserAccentLocale[]) => {
  // creates a flat array of locale/accent objects so that
  // all locales are at the same level for easier manipulations
  const localesFlat = accentLocales.reduce(
    (localeListFlat: { locale: string, accent_name?: string, accent_id?: number}[], locale: UserAccentLocale) => {
      // Flatten the accents and return the entire flat array
      return localeListFlat.concat(locale.accents.reduce((accentListFlat: any[], accent: any) => {
        return accentListFlat.concat({locale: locale.locale, accent_name: accent.name, accent_id: accent.id});
      }, []));
  }, []);

  // Get a list of all accents currently stored for this user
  const [savedLocales]: [
    { id: number; accent_id: number }[]
  ] = await db.query(`
      SELECT id, accent_id
      FROM user_client_accents
      WHERE client_id = ?
      ORDER BY id
    `,
    [clientId]
  );

  // Get a list of just the accent IDs of each for easier iterating
  const savedIds = savedLocales.map((saved) => saved.accent_id);
  const flatIds = localesFlat.map((locale) => locale.accent_id);

  // Do not re-insert accents that have already been saved
  // Filter out everything from localesFlat that already has a corresponding value in savedLocales
  const localesToUpdate = localesFlat.filter((accentLocale) => !savedIds.includes(accentLocale.accent_id));

  // delete accents that the user has de-selected
  const localesToDelete = savedLocales.filter((savedLocale) => !flatIds.includes(savedLocale.accent_id));

  return { localesToUpdate, localesToDelete };
}

/**
 * Updates accent entries for a given user
 *
 * @param clientId clientId as string
 * @param locales array of UserAccentLocales
 * @returns void
 */
async function updateLocales(clientId: string, accentLocales: UserAccentLocale[]) {
  const { localesToUpdate, localesToDelete } = await getLocalesDelta(clientId, accentLocales);

  // If the user has removed locale/accent values, remove entry from db
  if (localesToDelete.length > 0) {
    await db.query('DELETE FROM user_client_accents WHERE id IN (?)', [
      localesToDelete.map((accent) => accent.id),
    ]);
  }

  // Of the entries in savedLocales that are not the same as the input locales array
  // create any accents that are newly user submitted
  const newAccents = await Promise.all(
    localesToUpdate.map(async accent => {
      const localeId = await getLocaleId(accent.locale);
      let accentId = accent.accent_id;

      // If no accent ID exists, create new accent entry
      if (!accentId) {
        await db.query(
          `INSERT INTO accents (locale_id, accent_name, accent_token, user_submitted, client_id) values (?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE locale_id = locale_id`,
          [localeId, accent.accent_name, generateAccentToken(accent.accent_name), true, clientId]
        );

        const [
          [newAccent],
        ] = await db.query(
          `SELECT id FROM accents WHERE locale_id = ? AND accent_name = ? AND user_submitted`,
          [localeId, accent.accent_name]
        );

        accentId = newAccent.id;
      }

      return [clientId, localeId, accentId];
    })
  );

  // Finally, insert the new accent values into the user_client_accents table
  if (newAccents.length > 0) {
    await db.query(
      'INSERT INTO user_client_accents (client_id, locale_id, accent_id) VALUES ? ON DUPLICATE KEY UPDATE created_at = NOW()',
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
        SELECT
          u.*,
          accents.id AS accent_id,
          accents.accent_name,
          accents.accent_token,
          locales.name AS locale,
          ages.age,
          genders.gender
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
    const userObj = Object.values(
      rows.reduce((obj: { [client_id: string]: any }, row: any) => {
        const client = obj[row.client_id];
        obj[row.client_id] = {
          ...pick(row, 'client_id', 'accent', 'age', 'gender'),
          locales: {...compileLocales(client.locales, row)},
        };
        return obj;
      }, {})
    );

    return reduceLocales(userObj);
  },

  async findAccount(email: string): Promise<UserClientType> {
    // @TOOD: this would be better split out into a few smaller queries than one giant query, surely???
    const [rows] = await db.query(
      `
        SELECT DISTINCT
          u.*,
          accents.id AS accent_id,
          accents.accent_name,
          accents.accent_token,
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

    const userObj = rows.length == 0
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
            locales: {...compileLocales(client.locales, row)},
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

    return reduceLocales(userObj);
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
