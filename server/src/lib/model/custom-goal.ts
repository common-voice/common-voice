import { CustomGoalParams } from 'common/goals';
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

const SPEAK_GOAL_QUERY = `
  SELECT COALESCE(COUNT(clips.id), 0) AS count
  FROM clips
  WHERE client_id = ? AND locale_id = ? AND created_at >= ?
`;

const LISTEN_GOAL_QUERY = `
  SELECT COALESCE(COUNT(votes.id), 0) AS count
  FROM votes
  LEFT JOIN clips ON votes.clip_id = clips.id
  WHERE votes.client_id = ? AND clips.locale_id = ? AND votes.created_at >= ?
`;

export default {
  async create(client_id: string, locale: string, data: CustomGoalParams) {
    await db.query(
      `
      INSERT INTO custom_goals (client_id, locale_id, type, days_interval, amount)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        client_id,
        await getLocaleId(locale),
        data.type,
        data.daysInterval,
        data.amount,
      ]
    );
  },

  async find(client_id: string, locale_id?: number): Promise<any[]> {
    const [rows] = await db.query(
      `
        SELECT *
        FROM (
          SELECT
                 custom_goals.id,
                 locale_id, type, days_interval, amount, created_at,
                 locales.name AS locale
          FROM custom_goals
          LEFT JOIN locales ON custom_goals.locale_id = locales.id
          WHERE client_id = ? ${locale_id ? 'AND locale_id = ?' : ''}
          GROUP BY custom_goals.id
          ORDER BY created_at DESC
        ) t
        GROUP BY locale_id
      `,
      [client_id, locale_id || null]
    );

    return Promise.all(
      rows.map(async ({ type, locale, locale_id, ...data }: any) => {
        const [[{ current_interval_start }]] = await db.query(
          `
            SELECT TIMESTAMPADD(
              DAY,
              FLOOR(
                TIMESTAMPDIFF(DAY, TIMESTAMP(:created_at), NOW()) / :days_interval
              ) * :days_interval,
              :created_at
            ) AS current_interval_start
          `,
          data
        );

        const counts = await Promise.all(
          (type == 'both' ? ['speak', 'listen'] : [type]).map(async type => {
            const query = ({
              speak: SPEAK_GOAL_QUERY,
              listen: LISTEN_GOAL_QUERY,
            } as any)[type];

            if (!query) {
              throw new Error('Unknown type: ' + type);
            }

            const [rows] = await db.query(query, [
              client_id,
              locale_id,
              current_interval_start,
            ]);
            return [type, rows[0].count];
          })
        );

        return {
          ...data,
          locale,
          current_interval_start: new Date(
            current_interval_start
          ).toISOString(),
          current: counts.reduce((obj: any, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {}),
        };
      })
    );
  },
};
