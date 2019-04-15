import { SHA256 } from 'crypto-js';
import omit = require('lodash.omit');
import { getLocaleId } from './db';
import { getConfig } from '../../config-helper';
import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

async function getClipLeaderboard(locale?: string): Promise<any[]> {
  const [rows] = await db.query(
    `
      SELECT client_id,
             avatar_url,
             username,
             total,
             valid,
             ROUND(100 * valid / validated, 2) AS rate
      FROM (
        SELECT user_clients.*,
               COUNT(clip_id) AS total,
               COALESCE(SUM(upvotes >= 2 AND upvotes > downvotes), 0) AS valid,
               COALESCE(SUM(
                 (upvotes >= 2 OR downvotes >= 2) AND upvotes <> downvotes
               ), 0) AS validated
        FROM (
          SELECT user_clients.*,
                 clips.id AS clip_id,
                 SUM(votes.is_valid) AS upvotes,
                 SUM(!votes.is_valid) AS downvotes
          FROM user_clients
          LEFT JOIN clips ON user_clients.client_id = clips.client_id
          LEFT JOIN votes ON clips.id = votes.clip_id
          WHERE visible
          ${locale ? 'AND clips.locale_id = :locale_id' : ''}
          GROUP BY user_clients.client_id, clips.id
        ) user_clients
        GROUP BY client_id
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
             ROUND(100 * valid / validated, 2) AS rate
      FROM (
        SELECT user_clients.*,
               COUNT(vote_id) AS total,
               COALESCE(SUM(agree_count > disagree_count), 0) AS valid,
               COALESCE(SUM(
                 (agree_count >= 1 OR disagree_count >= 2)
                 AND agree_count <> disagree_count
               ), 0) AS validated
        FROM (
          SELECT user_clients.*,
                 votes.id AS vote_id,
                 SUM(votes.is_valid = other_votes.is_valid) AS agree_count,
                 SUM(votes.is_valid <> other_votes.is_valid) AS disagree_count
          FROM user_clients
          LEFT JOIN votes ON user_clients.client_id = votes.client_id
          LEFT JOIN clips ON votes.clip_id = clips.id
          LEFT JOIN votes other_votes ON clips.id = other_votes.clip_id
            AND other_votes.id <> votes.id
          WHERE visible
          ${locale ? 'AND clips.locale_id = :locale_id' : ''}
          GROUP BY user_clients.client_id, votes.id
        ) user_clients
        GROUP BY client_id
        HAVING total > 0
      ) t
      ORDER BY valid DESC, rate DESC, total DESC
    `,
    { locale_id: locale ? await getLocaleId(locale) : null }
  );

  return rows;
}

const CACHE_TIME_MS = 1000 * 60 * 20;

export const getFullClipLeaderboard = lazyCache(
  'clip-leaderboard',
  async (locale?: string) => {
    return (await getClipLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  CACHE_TIME_MS
);

export const getFullVoteLeaderboard = lazyCache(
  'vote-leaderboard',
  async (locale?: string) => {
    return (await getVoteLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  CACHE_TIME_MS
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
  const prepareRows = (rows: any[]) =>
    rows.map(row => ({
      ...omit(row, 'client_id'),
      clientHash: SHA256(row.client_id + getConfig().SECRET).toString(),
      you: row.client_id == client_id,
    }));

  const leaderboard = await (type == 'clip'
    ? getFullClipLeaderboard
    : getFullVoteLeaderboard)(locale);

  if (cursor) {
    return prepareRows(leaderboard.slice(cursor[0], cursor[1]));
  }

  const userIndex = leaderboard.findIndex(row => row.client_id == client_id);
  const userRegion =
    userIndex == -1 ? [] : leaderboard.slice(userIndex - 1, userIndex + 2);
  const partialBoard = [
    ...leaderboard.slice(0, 3 + Math.max(0, 3 - userRegion.length)),
    ...userRegion,
  ];
  return prepareRows(
    partialBoard.filter(
      ({ position }, i) =>
        i == partialBoard.findIndex(row => row.position == position)
    )
  );
}
