import { SHA256 } from 'crypto-js';
import omit = require('lodash.omit');
import { getLocaleId, getParticipantSubquery } from './db';
import { getConfig } from '../../config-helper';
import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import Bucket from '../bucket';
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
  team_only: boolean;
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
async function getTopSpeakers({
  client_id,
  challenge,
  locale,
  team_only,
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
              ${getParticipantSubquery(team_only ? 'team' : 'general')}
            ) participant
            LEFT JOIN clips ON participant.client_id = clips.client_id
                AND clips.locale_id = (SELECT id FROM locales WHERE name = ?)
                AND clips.created_at BETWEEN start_date AND end_date
            LEFT JOIN votes ON clips.id = votes.clip_id
                AND votes.created_at BETWEEN start_date AND end_date
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

async function getTopListeners({
  client_id,
  challenge,
  locale,
  team_only,
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
              ${getParticipantSubquery(team_only ? 'team' : 'general')}
            ) participant
            LEFT JOIN votes ON participant.client_id = votes.client_id
                AND votes.created_at BETWEEN start_date AND end_date
            LEFT JOIN clips ON votes.clip_id = clips.id
                AND clips.locale_id = (SELECT id FROM locales WHERE name = ?)
            LEFT JOIN votes other_votes ON clips.id = other_votes.clip_id AND other_votes.id <> votes.id
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

// get current team rankings
// [TODO](can) get team rankings of all 3 weeks
async function getTopTeams(challenge: string): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT id, name, logo, w1_points, w1, w2_points, w2,
        @curw3 := IF(@value3 = w3_points, @curw3, @nextw3) AS w3,
        @nextw3 := @nextw3 + 1 AS nextRank,
        @value3 := w3_points AS points
    FROM (
        SELECT id, name, logo, w1_points, w1, w3_points,
            @curw2 := IF(@value2 = w2_points, @curw2, @nextw2) AS w2,
            @nextw2 := @nextw2 + 1 AS nextRank,
            @value2 := w2_points AS w2_points
        FROM (
            SELECT id, name, logo, w2_points, w3_points,
              @curw1 := IF(@value1 = w1_points, @curw1, @nextw1) AS w1,
              @nextw1 := @nextw1 + 1 AS nextRank,
              @value1 := w1_points AS w1_points
            FROM (
                SELECT teams.id, teams.name, teams.logo_url AS logo,
                    SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 1, challenges.start_date)) * points) AS w1_points,
                    SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 2, challenges.start_date)) * points) AS w2_points,
                    SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)) * points) AS w3_points
                FROM challenges
                LEFT JOIN teams ON challenges.id = teams.challenge_id
                LEFT JOIN earn ON earn.team_id = teams.id
                    AND earn.client_id IS NULL
                    AND earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                LEFT JOIN achievements ON achievements.id = earn.achievement_id
                    AND achievements.challenge_id = challenges.id 
                WHERE challenges.url_token = ?
                GROUP BY teams.id, teams.name, teams.logo_url
                ORDER BY w1_points DESC
            ) teams, (SELECT @curw1 :=0, @value1 := NULL, @nextw1 := 1) r
            GROUP BY id
            ORDER BY w2_points DESC
        ) teams, (SELECT @curw2 :=0, @value2 := NULL, @nextw2 := 1) r
        GROUP BY id
        ORDER BY w3_points DESC
    ) teams, (SELECT @curw3 :=0, @value3 := NULL, @nextw3 := 1) r
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

export const getTopSpeakersLeaderboard = lazyCache(
  'top-speaker-leaderboard',
  async ({
    client_id,
    challenge,
    locale,
    team_only,
  }: ChallengeLeaderboardArgument) => {
    return (await getTopSpeakers({
      client_id,
      challenge,
      locale,
      team_only,
    })).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  CACHE_TIME_MS
);

export const getTopListenersLeaderboard = lazyCache(
  'top-listener-leaderboard',
  async ({
    client_id,
    challenge,
    locale,
    team_only,
  }: ChallengeLeaderboardArgument) => {
    return (await getTopListeners({
      client_id,
      challenge,
      locale,
      team_only,
    })).map((row, i) => ({
      position: i,
      ...row,
    }));
  },
  CACHE_TIME_MS
);

export const getTopTeamsLeaderboard = lazyCache(
  'top-teams-leaderboard',
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
          ? getTopSpeakersLeaderboard
          : getTopListenersLeaderboard)({
          client_id,
          challenge,
          locale,
          team_only: false,
        });
        break;
      case 'members':
        leaderboard = await (type == 'clip'
          ? getTopSpeakersLeaderboard
          : getTopListenersLeaderboard)({
          client_id,
          challenge,
          locale,
          team_only: true,
        });
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
