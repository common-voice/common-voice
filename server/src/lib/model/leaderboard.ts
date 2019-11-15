import { SHA256 } from 'crypto-js';
import omit = require('lodash.omit');
import { getLocaleId, getParticipantSubquery } from './db';
import { getConfig } from '../../config-helper';
import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import Bucket from '../bucket';
import { AWS } from '../aws';
import Model from '../model';
import { ChallengeLeaderboardArgument, ChallengeToken } from 'common/challenge';

const s3 = AWS.getS3();
const model = new Model();
const bucket = new Bucket(model, s3);

const db = getMySQLInstance();

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

// NOTE: The top-related SQLs
// 1) think the huge SQL as a process of adding aggregated attributes to user_clients rows:
//    first add bonus, then add clips as well as the votes for the clips, at last do calculation.
// 2) limit bonus and clips, (maybe not votes), within the range of the challenge time span;
//    add select only those who has positive points.
// 3) be careful in deciding where to put the filtering conditions: in LEFT JOIN or in WHERE, big differences,
//    most of the conditions are in LEFT JOIN to avoid missing the necessary rows when null occurs on optional columns.
// 4) some of the conditions are probably over-thinking.
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

// show all teams' rankings across 3 weeks.
// NOTE: explain the meaning of the returned result of the terrifying SQL.
// 1) w1, w2, w3 is the team rankings in the first, second, third week respectively.
//    w1_point, w2_point, w3_point is the _team_points_ in the first, second, third week respectively.
// 2) w2 take into account of the w1_point and w2_point.
//    w3 take into account of the w1_point, w2_point and w3_point.
// 3) w2_point include the w1_point and w3_point include w2_point and w1_point.
// _team_points_ = team_bonus + all_member_bonus + all_member_points.
// [FUTURE] there are maybe several ways to optimize the SQL here
//          and when new version of DB is available, ranking() and window function could be used
async function getTopTeams(challenge: ChallengeToken): Promise<any[]> {
  const [rows] = await db.query(
    `
    SELECT id, name, w1_points, w1, w2_points, w2,
        @cur3 := IF(@point3 = w3_points, @cur3, @next3) AS w3,
        @next3 := @next3 + 1 AS nextRank,
        @point3 := w3_points AS w3_points
    FROM (
        SELECT id, name, w1_points, w1, w3_points,
            @cur2 := IF(@point2 = w2_points, @cur2, @next2) AS w2,
            @next2 := @next2 + 1 AS nextRank,
            @point2 := w2_points AS w2_points
        FROM (
            SELECT id, name, w2_points, w3_points,
              @cur1 := IF(@point1 = w1_points, @cur1, @next1) AS w1,
              @next1 := @next1 + 1 AS nextRank,
              @point1 := w1_points AS w1_points
            FROM (
                SELECT teams.id, teams.name,
                    teams.w1_points + members.w1_points AS w1_points,
                    teams.w2_points + members.w2_points AS w2_points,
                    teams.w3_points + members.w3_points AS w3_points
                FROM (
                    SELECT teams.id, teams.name,
                        COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 1, challenges.start_date)) * points), 0) AS w1_points,
                        COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 2, challenges.start_date)) * points), 0) AS w2_points,
                        COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)) * points), 0) AS w3_points
                    FROM challenges
                    LEFT JOIN teams ON challenges.id = teams.challenge_id
                    LEFT JOIN earn ON earn.team_id = teams.id
                        AND earn.client_id IS NULL
                        AND earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                    LEFT JOIN achievements ON achievements.id = earn.achievement_id
                        AND achievements.challenge_id = challenges.id 
                    WHERE challenges.url_token = ?
                    GROUP BY teams.id, teams.name
                ) teams
                LEFT JOIN (
                    SELECT team_id, team_name, SUM(bonus) AS user_bonus, SUM(clip_points) AS clip_points, SUM(vote_points) AS vote_points,
                        SUM(w1_points) AS w1_points,
                        SUM(w2_points) AS w2_points,
                        SUM(w3_points) AS w3_points
                    FROM (
                        SELECT speaker.client_id, team_id, team_name, bonus, clip_points, COUNT(votes.id) AS vote_points,
                            w1_points + COALESCE(SUM(votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 1, start_date)), 0) AS w1_points,
                            w2_points + COALESCE(SUM(votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 2, start_date)), 0) AS w2_points,
                            w3_points + COALESCE(SUM(votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)), 0) AS w3_points
                        FROM (
                            SELECT challenger.client_id, team_id, team_name, start_date, bonus, COUNT(clips.id) AS clip_points,
                                w1_points + COALESCE(SUM(clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 1, start_date)), 0) AS w1_points,
                                w2_points + COALESCE(SUM(clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 2, start_date)), 0) AS w2_points,
                                w3_points + COALESCE(SUM(clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)), 0) AS w3_points
                            FROM (
                              SELECT user_clients.client_id, teams.id AS team_id, teams.name AS team_name,
                                  challenges.start_date AS start_date,
                                  COALESCE(SUM(achievements.points), 0) AS bonus,
                                  COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 1, challenges.start_date)) * points), 0) AS w1_points,
                                  COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 2, challenges.start_date)) * points), 0) AS w2_points,
                                  COALESCE(SUM((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)) * points), 0) AS w3_points
                              FROM user_clients
                              LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
                              LEFT JOIN challenges ON enroll.challenge_id = challenges.id
                              LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
                              LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
                                  AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
                              LEFT JOIN achievements ON earn.achievement_id = achievements.id
                                  AND challenges.id = achievements.challenge_id
                              WHERE email <> ''
                              AND challenges.url_token = ?
                              GROUP BY user_clients.client_id, team_id, team_name, start_date
                            ) challenger
                            LEFT JOIN clips ON challenger.client_id = clips.client_id AND clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
                            GROUP BY challenger.client_id, team_id, team_name, start_date, bonus, w1_points, w2_points, w3_points
                        ) speaker
                        LEFT JOIN votes ON speaker.client_id = votes.client_id AND votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
                        GROUP BY speaker.client_id, team_id, team_name, speaker.bonus, speaker.clip_points, w1_points, w2_points, w3_points
                    ) voter
                    GROUP BY team_id
                ) members ON teams.id = members.team_id AND teams.name = members.team_name
                ORDER BY w1_points DESC
            ) teams, (SELECT @cur1 :=0, @point1 := NULL, @next1 := 1) r
            GROUP BY id
            ORDER BY w2_points DESC
        ) teams, (SELECT @cur2 :=0, @point2 := NULL, @next2 := 1) r
        GROUP BY id
        ORDER BY w3_points DESC
    ) teams, (SELECT @cur3 :=0, @point3 := NULL, @next3 := 1) r
    `,
    [challenge, challenge]
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
  async (challenge: ChallengeToken) => {
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
