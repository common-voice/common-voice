import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import Model from '../model';

const db = getMySQLInstance();

export const getPastDateRange = (): string[] => {
  const months = new Array(12)
    .fill(0)
    .map((s, i) => `NOW() - INTERVAL ${i + 1} MONTH`);
  const today = new Date();
  today.setDate(1); //ensure first of month
  return months;
};

export const getDownloaderCount = lazyCache(
  'downloader-monthly-stats',
  async () => {
    return await getDownloadersPastTwelveMonths();
  },
  1
);

const getDownloadersPastTwelveMonths = async () => {
  const [rows] = await db.query(`
    SELECT
    DATE_FORMAT(created_at, "%Y-%c-%d") as date,
    id as count
    FROM
      downloaders d
    WHERE
      created_at > now() - INTERVAL 12 MONTH
    GROUP BY
      date_format(created_at, '%c')
    ORDER BY created_at ASC
  `);
  return rows;
};

async function getVoteLeaderboard(locale?: string): Promise<any[]> {
  const [rows] = await db.query(
    `
      SELECT user_clients.client_id,
             avatar_url,
             avatar_clip_url,
             username,
             count(votes.id) as total
      FROM user_clients
      LEFT JOIN votes ON user_clients.client_id = votes.client_id
      LEFT JOIN clips ON votes.clip_id = clips.id
          WHERE visible = 1
          ${locale ? 'AND clips.locale_id = :locale_id' : ''}
      GROUP BY client_id
        HAVING total > 0
      ORDER BY total DESC
    `
  );

  return rows;
}
