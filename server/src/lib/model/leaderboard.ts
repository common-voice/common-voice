import { SHA256 } from 'crypto-js';
import omit = require('lodash.omit');
import { getLocaleId } from './db';
import { getConfig } from '../../config-helper';
import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import Bucket from '../bucket';
import { S3 } from 'aws-sdk';
import { AWS } from '../aws';
import Model from '../model';

const s3 = AWS.getS3();
const model = new Model();
const bucket = new Bucket(model, s3);

const db = getMySQLInstance();

interface ChallengeLeaderboardArgument {
  client_id: string;
  challenge: string;
  locale: string;
}

async function getClipLeaderboard(locale?: string): Promise<any[]> {
  const [rows] = await db.query(
    `
      SELECT client_id,
             avatar_url,
             avatar_clip_url,
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
             avatar_clip_url,
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

// NOTE: The 4 top-related SQLs
// 1) think the huge SQL as a process of adding aggregated attributes to user_clients rows:
// first add bonus, then add clips as well as the votes for the clips, at last do calculation.
// 2) only calculate values within the range of the challenge time span for bonus and clips, (maybe not votes).
// 3) be careful in deciding where to put the filtering conditions: in LEFT JOIN or in WHERE, big differences.
// 4) surely it can be optimized in that:
//        participant in sql are ALMOST identical;
//        topContributor and topMember sqls are different only in the WHERE clause.
// 5) some of the conditions are probably over-thinking.
async function getClipTopContributors({
  client_id,
  challenge,
  locale,
}: ChallengeLeaderboardArgument): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT client_id, avatar_url, username AS name, total AS points, valid AS approved, ROUND(100 * valid / validated, 2) AS accuracy
    FROM (
        SELECT speaker.client_id, avatar_url, username,
            COUNT(clip_id) + bonus AS total,
            COALESCE(SUM(upvotes >= 2 AND upvotes > downvotes), 0) AS valid,
            COALESCE(SUM((upvotes >= 2 OR downvotes >= 2) AND upvotes <> downvotes), 0) AS validated
        FROM (
            SELECT participant.client_id, avatar_url, username, start_date, end_date, bonus,
                clips.id AS clip_id,
                SUM(votes.is_valid) AS upvotes,
                SUM(!votes.is_valid) AS downvotes
            FROM (
                SELECT user_clients.client_id, avatar_url, username,
                    challenges.start_date AS start_date,
                    TIMESTAMPADD(WEEK, 3, challenges.start_date) AS end_date,
                    COALESCE(SUM(achievements.points), 0) AS bonus
                FROM user_clients
                LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
                LEFT JOIN challenges ON enroll.challenge_id = challenges.id
                LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
                LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
                LEFT JOIN achievements ON earn.achievement_id = achievements.id
                    AND challenges.id = achievements.challenge_id
                    AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                WHERE ((visible = 0 AND user_clients.client_id = ?)
                    OR (visible = 1)
                    OR (visible = 2 AND teams.id = (
                        SELECT team_id
                        FROM enroll e LEFT JOIN challenges c ON e.challenge_id = c.id
                        WHERE e.client_id = ? AND c.url_token = ?
                    ))
                )
                AND challenges.url_token = ?
                GROUP BY user_clients.client_id, avatar_url, username, start_date,end_date
            ) participant
            LEFT JOIN clips ON participant.client_id = clips.client_id
                AND clips.created_at BETWEEN start_date AND end_date
            LEFT JOIN votes ON clips.id = votes.clip_id
                AND votes.created_at BETWEEN start_date AND end_date
            WHERE clips.locale_id = (SELECT id FROM locales WHERE name = ?)
            GROUP BY participant.client_id, avatar_url, username, start_date, end_date, bonus, clips.id
        ) speaker
        GROUP BY speaker.client_id, avatar_url, username, bonus
        HAVING total > 0
    ) t
    ORDER BY points DESC, approved DESC, accuracy DESC
    `,
    [client_id, client_id, challenge, challenge, locale]
  );
  return rows;
}

async function getVoteTopContributors({
  client_id,
  challenge,
  locale,
}: ChallengeLeaderboardArgument): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT client_id, avatar_url, username AS name, total AS points, valid AS approved, ROUND(100 * valid / validated, 2) AS accuracy
    FROM (
        SELECT voter.client_id, avatar_url, username,
            COUNT(vote_id) + bonus AS total,
            COALESCE(SUM(agree_count > disagree_count), 0) AS valid,
            COALESCE(SUM((agree_count >= 1 OR disagree_count >= 2) AND agree_count <> disagree_count), 0) AS validated
        FROM (
            SELECT participant.client_id, avatar_url, username, bonus,
            votes.id AS vote_id,
            COALESCE(SUM(votes.is_valid = other_votes.is_valid), 0) AS agree_count,
            COALESCE(SUM(votes.is_valid <> other_votes.is_valid), 0) AS disagree_count
            FROM (
                SELECT user_clients.client_id, avatar_url, username,
                    challenges.start_date AS start_date,
                    TIMESTAMPADD(WEEK, 3, challenges.start_date) AS end_date,
                    COALESCE(SUM(achievements.points), 0) AS bonus
                FROM user_clients
                LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
                LEFT JOIN challenges ON enroll.challenge_id = challenges.id
                LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
                LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
                LEFT JOIN achievements ON earn.achievement_id = achievements.id
                    AND challenges.id = achievements.challenge_id
                    AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                WHERE ((visible = 0 AND user_clients.client_id = ?)
                    OR (visible = 1)
                    OR (visible = 2 AND teams.id = (
                        SELECT team_id
                        FROM enroll e LEFT JOIN challenges c ON e.challenge_id = c.id
                        WHERE e.client_id = ? AND c.url_token = ?
                    ))
                )
                AND challenges.url_token = ?
                GROUP BY user_clients.client_id, avatar_url, username, start_date, end_date
            ) participant
            LEFT JOIN votes ON participant.client_id = votes.client_id
                AND votes.created_at BETWEEN start_date AND end_date
            LEFT JOIN clips ON votes.clip_id = clips.id
            LEFT JOIN votes other_votes ON clips.id = other_votes.clip_id AND other_votes.id <> votes.id
            WHERE clips.locale_id = (SELECT id FROM locales WHERE name = ?)
            GROUP BY participant.client_id, avatar_url, username, bonus, votes.id
        ) voter
        GROUP BY voter.client_id, avatar_url, username, bonus
        HAVING total > 0
    ) t
    ORDER BY points DESC, approved DESC, accuracy DESC
    `,
    [client_id, client_id, challenge, challenge, locale]
  );
  return rows;
}

async function getClipTopMembers({
  client_id,
  challenge,
  locale,
}: ChallengeLeaderboardArgument): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT client_id, avatar_url, username AS name, total AS points, valid AS approved, ROUND(100 * valid / validated, 2) AS accuracy
    FROM (
        SELECT speaker.client_id, avatar_url, username,
            COUNT(clip_id) + bonus AS total,
            COALESCE(SUM(upvotes >= 2 AND upvotes > downvotes), 0) AS valid,
            COALESCE(SUM((upvotes >= 2 OR downvotes >= 2) AND upvotes <> downvotes), 0) AS validated
        FROM (
            SELECT participant.client_id, avatar_url, username, start_date, end_date, bonus,
                clips.id AS clip_id,
                SUM(votes.is_valid) AS upvotes,
                SUM(!votes.is_valid) AS downvotes
            FROM (
                SELECT user_clients.client_id, avatar_url, username,
                    challenges.start_date AS start_date,
                    TIMESTAMPADD(WEEK, 3, challenges.start_date) AS end_date,
                    COALESCE(SUM(achievements.points), 0) AS bonus
                FROM user_clients
                LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
                LEFT JOIN challenges ON enroll.challenge_id = challenges.id
                LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
                LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
                LEFT JOIN achievements ON earn.achievement_id = achievements.id
                    AND challenges.id = achievements.challenge_id
                    AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                WHERE (visible OR (visible = 0 AND user_clients.client_id = ?))
                AND challenges.url_token = ?
                AND enroll.team_id = (
                    SELECT team_id FROM enroll e
                    LEFT JOIN challenges c ON e.challenge_id = c.id
                    WHERE e.client_id = ? AND c.url_token = ?
                )
                GROUP BY user_clients.client_id, avatar_url, username, start_date,end_date
            ) participant
            LEFT JOIN clips ON participant.client_id = clips.client_id
                AND clips.created_at BETWEEN start_date AND end_date
            LEFT JOIN votes ON clips.id = votes.clip_id
                AND votes.created_at BETWEEN start_date AND end_date
            WHERE clips.locale_id = (SELECT id FROM locales WHERE name = ?)
            GROUP BY participant.client_id, avatar_url, username, start_date, end_date, bonus, clips.id
        ) speaker
        GROUP BY speaker.client_id, avatar_url, username, bonus
        HAVING total > 0
    ) t
    ORDER BY points DESC, approved DESC, accuracy DESC
    `,
    [client_id, challenge, client_id, challenge, locale]
  );
  return rows;
}

async function getVoteTopMembers({
  client_id,
  challenge,
  locale,
}: ChallengeLeaderboardArgument): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT client_id, avatar_url, username AS name, total AS points, valid AS approved, ROUND(100 * valid / validated, 2) AS accuracy
    FROM (
        SELECT voter.client_id, avatar_url, username,
            COUNT(vote_id) + bonus AS total,
            COALESCE(SUM(agree_count > disagree_count), 0) AS valid,
            COALESCE(SUM((agree_count >= 1 OR disagree_count >= 2) AND agree_count <> disagree_count), 0) AS validated
        FROM (
            SELECT participant.client_id, avatar_url, username, bonus,
            votes.id AS vote_id,
            COALESCE(SUM(votes.is_valid = other_votes.is_valid), 0) AS agree_count,
            COALESCE(SUM(votes.is_valid <> other_votes.is_valid), 0) AS disagree_count
            FROM (
                SELECT user_clients.client_id, avatar_url, username,
                    challenges.start_date AS start_date,
                    TIMESTAMPADD(WEEK, 3, challenges.start_date) AS end_date,
                    COALESCE(SUM(achievements.points), 0) AS bonus
                FROM user_clients
                LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
                LEFT JOIN challenges ON enroll.challenge_id = challenges.id
                LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
                LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
                LEFT JOIN achievements ON earn.achievement_id = achievements.id
                    AND challenges.id = achievements.challenge_id
                    AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                WHERE (visible OR (visible = 0 AND user_clients.client_id = ?))
                AND challenges.url_token = ?
                AND enroll.team_id = (
                    SELECT team_id FROM enroll e
                    LEFT JOIN challenges c ON e.challenge_id = c.id
                    WHERE e.client_id = ? AND c.url_token = ?
                )
                GROUP BY user_clients.client_id, avatar_url, username, start_date, end_date
            ) participant
            LEFT JOIN votes ON participant.client_id = votes.client_id
                AND votes.created_at BETWEEN start_date AND end_date
            LEFT JOIN clips ON votes.clip_id = clips.id
            LEFT JOIN votes other_votes ON clips.id = other_votes.clip_id AND other_votes.id <> votes.id
            WHERE clips.locale_id = (SELECT id FROM locales WHERE name = ?)
            GROUP BY participant.client_id, avatar_url, username, bonus, votes.id
        ) voter
        GROUP BY voter.client_id, avatar_url, username, bonus
        HAVING total > 0
    ) t
    ORDER BY points DESC, approved DESC, accuracy DESC
    `,
    [client_id, challenge, client_id, challenge, locale]
  );
  return rows;
}

// get current team rankings
async function getTopTeams(challenge: string): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT id, name, logo,
        @curRank := IF(@value = points, @curRank, @nextRank) AS rank,
        @nextRank := @nextRank + 1 AS nextRank,
        @value := points AS points
    FROM (
        SELECT teams.id, teams.name, teams.logo_url AS logo,
            SUM((earned_at BETWEEN challenges.start_date AND NOW()) * points) AS points
        FROM earn
        JOIN achievements ON achievements.id = earn.achievement_id
        JOIN teams ON earn.team_id = teams.id
        JOIN challenges ON achievements.challenge_id = challenges.id AND teams.challenge_id = challenges.id
        WHERE client_id IS NULL
        AND team_id IS NOT NULL
        AND earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
        AND challenges.url_token = ?
        GROUP BY teams.id, teams.name, teams.logo_url
        ORDER BY points DESC
    ) teams, (SELECT @curRank :=0, @value := NULL, @nextRank := 1) r
    `,
    [challenge]
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

export const getClipTopContributorsLeaderboard = lazyCache(
  'clip-topContributors-leaderboard',
  async ({ client_id, challenge, locale }: ChallengeLeaderboardArgument) => {
    return (await getClipTopContributors({ client_id, challenge, locale })).map(
      (row, i) => ({
        position: i,
        ...row,
      })
    );
  },
  CACHE_TIME_MS
);

export const getVoteTopContributorsLeaderboard = lazyCache(
  'vote-topContributors-leaderboard',
  async ({ client_id, challenge, locale }: ChallengeLeaderboardArgument) => {
    return (await getVoteTopContributors({ client_id, challenge, locale })).map(
      (row, i) => ({
        position: i,
        ...row,
      })
    );
  },
  CACHE_TIME_MS
);

export const getClipTopMembersLeaderboard = lazyCache(
  'clip-topMembers-leaderboard',
  async ({ client_id, challenge, locale }: ChallengeLeaderboardArgument) => {
    return (await getClipTopMembers({ client_id, challenge, locale })).map(
      (row, i) => ({
        position: i,
        ...row,
      })
    );
  },
  CACHE_TIME_MS
);

export const getVoteTopMembersLeaderboard = lazyCache(
  'vote-topMembers-leaderboard',
  async ({ client_id, challenge, locale }: ChallengeLeaderboardArgument) => {
    return (await getVoteTopMembers({ client_id, challenge, locale })).map(
      (row, i) => ({
        position: i,
        ...row,
      })
    );
  },
  CACHE_TIME_MS
);

export const getTopTeamsLeaderboard = lazyCache(
  'topTeams-leaderboard',
  async (challenge: string) => {
    return (await getTopTeams(challenge)).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  CACHE_TIME_MS
);

// use the leaderboard functionality in Stats and Challenge board
// this leaderboard functionality includes: cursor and assigning positions.
export default async function getLeaderboard({
  dashboard,
  type,
  client_id,
  cursor,
  locale,
  arg,
}: {
  dashboard: 'stats' | 'challenge';
  type?: 'clip' | 'vote';
  client_id: string;
  cursor?: [number, number];
  locale: string;
  arg?: any;
}) {
  const prepareRows = (rows: any[]) =>
    rows.map(row => ({
      ...omit(row, 'client_id', 'avatar_clip_url'),
      avatarClipUrl: row.avatar_clip_url
        ? bucket.getAvatarClipsUrl(row.avatar_clip_url)
        : null,
      clientHash: SHA256(row.client_id + getConfig().SECRET).toString(),
      you: row.client_id == client_id,
    }));

  let leaderboard = [];
  if (dashboard == 'stats') {
    leaderboard = await (type == 'clip'
      ? getFullClipLeaderboard
      : getFullVoteLeaderboard)(locale);
  } else if (dashboard == 'challenge') {
    const { scope, challenge } = arg;
    switch (scope) {
      case 'contributors':
        leaderboard = await (type == 'clip'
          ? getClipTopContributorsLeaderboard
          : getVoteTopContributorsLeaderboard)({
          client_id,
          challenge,
          locale,
        });
        break;
      case 'members':
        leaderboard = await (type == 'clip'
          ? getClipTopMembersLeaderboard
          : getVoteTopMembersLeaderboard)({ client_id, challenge, locale });
        break;
      case 'teams':
        leaderboard = await getTopTeamsLeaderboard(challenge);
        break;
    }
  }

  if (cursor) {
    return prepareRows(leaderboard.slice(cursor[0], cursor[1]));
  }

  const userIndex = leaderboard.findIndex(row => row.client_id == client_id);
  const userRegion =
    userIndex == -1 ? [] : leaderboard.slice(userIndex - 1, userIndex + 2);
  const partialBoard = [
    ...leaderboard.slice(0, 10 + Math.max(0, 10 - userRegion.length)),
    ...userRegion,
  ];
  return prepareRows(
    partialBoard.filter(
      ({ position }, i) =>
        i == partialBoard.findIndex(row => row.position == position)
    )
  );
}
