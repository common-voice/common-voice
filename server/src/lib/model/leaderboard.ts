import omit = require('lodash.omit');
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';
import lazyCache from '../lazy-cache';

const db = getMySQLInstance();

async function getClipLeaderboard(locale?: string): Promise<any[]> {
  const [rows] = await db.query(
    `
      SELECT client_id,
             avatar_url,
             username,
             total,
             valid,
             ROUND(100 * COALESCE(valid / validated, 0), 2) AS rate
      FROM (
        SELECT
          user_clients.*,
          COUNT(clips.id) AS total,
          (
            SELECT COUNT(*)
            FROM (
              SELECT clips.client_id,
                     SUM(votes.is_valid) AS upvotes,
                     SUM(!votes.is_valid) AS downvotes
              FROM clips
              LEFT JOIN votes ON clips.id = votes.clip_id
              ${locale ? 'WHERE clips.locale_id = :locale_id' : ''}
              GROUP BY clips.id
              HAVING upvotes >= 2 AND upvotes > downvotes
            ) t
            WHERE t.client_id = user_clients.client_id
          ) AS valid,
          (
            SELECT COUNT(*)
            FROM (
              SELECT clips.client_id,
                     SUM(votes.is_valid) AS upvotes,
                     SUM(!votes.is_valid) AS downvotes
              FROM clips
              LEFT JOIN votes ON clips.id = votes.clip_id
              ${locale ? 'WHERE clips.locale_id = :locale_id' : ''}
              GROUP BY clips.id
              HAVING (upvotes >= 2 OR downvotes >= 2) AND upvotes <> downvotes
            ) t
            WHERE t.client_id = user_clients.client_id
          ) AS validated
        FROM user_clients
        LEFT JOIN clips ON user_clients.client_id = clips.client_id ${
          locale ? 'AND locale_id = :locale_id' : ''
        }
        GROUP BY user_clients.client_id
        HAVING total > 0
      ) t
      ORDER BY valid DESC, rate DESC, total DESC
      `,
    { locale_id: locale ? await getLocaleId(locale) : null }
  );
  return rows;
}

async function getVoteLeaderboard(locale?: string): Promise<any[]> {
  const [rows] = await db.query(
    `
      SELECT client_id,
             avatar_url,
             username,
             total,
             valid,
             ROUND(100 * COALESCE(valid / validated, 0), 2) AS rate
      FROM (
        SELECT
          user_clients.*,
          COUNT(votes.id) AS total,
          (
            SELECT COUNT(*)
            FROM (
              SELECT votes.client_id,
                     SUM(votes.is_valid = all_votes.is_valid) AS agree_count,
                     SUM(votes.is_valid <> all_votes.is_valid) AS disagree_count
              FROM votes
              LEFT JOIN clips ON votes.clip_id = clips.id
              LEFT JOIN votes all_votes ON clips.id = all_votes.clip_id
               AND all_votes.id <> votes.id
              ${locale ? 'WHERE clips.locale_id = :locale_id' : ''}
              GROUP BY votes.client_id, votes.clip_id
              HAVING agree_count > disagree_count
            ) t
            WHERE t.client_id = user_clients.client_id
          ) AS valid,
          (
            SELECT COUNT(*)
            FROM (
              SELECT votes.client_id,
                     SUM(all_votes.is_valid) AS upvotes,
                     SUM(!all_votes.is_valid) AS downvotes
              FROM votes
              LEFT JOIN clips ON votes.clip_id = clips.id
              LEFT JOIN votes all_votes ON all_votes.clip_id = clips.id
              ${locale ? 'WHERE clips.locale_id = :locale_id' : ''}
              GROUP BY votes.client_id, votes.clip_id
              HAVING (upvotes >= 2 OR downvotes >= 2) AND upvotes <> downvotes
            ) t
            WHERE t.client_id = votes.client_id
          ) AS validated
        FROM user_clients
        LEFT JOIN votes on user_clients.client_id = votes.client_id
        LEFT JOIN clips on votes.clip_id = clips.id
        ${locale ? 'WHERE clips.locale_id = :locale_id' : ''}
        GROUP BY user_clients.client_id
        HAVING total > 0 
      ) t
      ORDER BY valid DESC, rate DESC, total DESC  
      `,
    { locale_id: locale ? await getLocaleId(locale) : null }
  );

  return rows;
}

const HOUR = 1000 * 60 * 60;

function omitClientId(rows: any[]) {
  return rows.map(row => omit(row, 'client_id'));
}

export const getFullClipLeaderboard = lazyCache(
  'clip-leaderboard',
  async (locale?: string) => {
    return (await getClipLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  HOUR
);

export const getFullVoteLeaderboard = lazyCache(
  'vote-leaderboard',
  async (locale?: string) => {
    return (await getVoteLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  HOUR
);

export default async function getLeaderboard({
  type,
  client_id,
  cursor,
  locale,
}: {
  type: 'clip' | 'vote';
  client_id: string;
  cursor?: [number, number];
  locale: string;
}) {
  const leaderboard = await (type == 'clip'
    ? getFullClipLeaderboard
    : getFullVoteLeaderboard)(locale);
  if (cursor) {
    return omitClientId(leaderboard.slice(cursor[0], cursor[1]));
  }

  const userIndex = leaderboard.findIndex(row => row.client_id == client_id);
  const userRegion =
    userIndex == -1 ? [] : leaderboard.slice(userIndex - 1, userIndex + 2);
  const partialBoard = [
    ...leaderboard.slice(0, 2 + Math.max(0, 3 - userRegion.length)),
    ...userRegion,
  ];
  return omitClientId(
    partialBoard.filter(
      ({ position }, i) =>
        i == partialBoard.findIndex(row => row.position == position)
    )
  );
}
