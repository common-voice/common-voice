import { SHA256 } from 'crypto-js'

import { getLocaleId, getParticipantSubquery } from './db'
import { getConfig } from '../../config-helper'
import lazyCache from '../lazy-cache'
import { getMySQLInstance } from './db/mysql'
import Bucket from '../bucket'
import Model from '../model'
import { ChallengeLeaderboardArgument, ChallengeToken, TimeUnits } from 'common'

const model = new Model()
const bucket = new Bucket(model)

const db = getMySQLInstance()

/**
 * NEW IMPLEMENTATION
 *
 * We are getting all data with language attached and cache
 * Then extract locale based data in code on demand
 * The main bottleneck was number of scanned rows and attached IO time
 * With the added indexes, this will drop coonsiderably
 *
 * - On FE by default ALL will be shown, language based ones are on demand
 * - We can know fetch duration of ALL, but per language they differ too much
 * - With missing DB table indexes added, the query will be faster (to be measured)
 * - As of now we have 3.8M user records, with 51k visible, so it is a much smaller subset
 *
 */

// Get ALL clip leaderboard data with locales in one query
async function getAllClipLeaderboardData(): Promise<any[]> {
  const query = `
    SELECT 
      uc.client_id,
      uc.avatar_url,
      uc.avatar_clip_url,
      uc.username,
      c.locale_id,
      COUNT(c.id) AS total
    FROM user_clients uc
    INNER JOIN clips c ON uc.client_id = c.client_id
    WHERE uc.visible = 1
    GROUP BY uc.client_id, c.locale_id
    HAVING total > 0
  `

  const [rows] = await db.query(query)
  console.log(`Clip Leaderboard rows = ${rows.length}`)
  return rows
}

// Get ALL vote leaderboard data with locales in one query
async function getAllVoteLeaderboardData(): Promise<any[]> {
  const query = `
    SELECT 
      uc.client_id,
      uc.avatar_url,
      uc.avatar_clip_url,
      uc.username,
      c.locale_id,
      COUNT(v.id) AS total
    FROM user_clients uc
    INNER JOIN votes v ON uc.client_id = v.client_id
    INNER JOIN clips c ON v.clip_id = c.id
    WHERE uc.visible = 1
    GROUP BY uc.client_id, c.locale_id
    HAVING total > 0
  `

  const [rows] = await db.query(query)
  console.log(`Vote Leaderboard rows = ${rows.length}`)
  return rows
}

const getAllLeaderboardData = () => {
  return lazyCache(
    'cv:leaderboard:all',
    async () => {
      const [clipData, voteData] = await Promise.all([
        getAllClipLeaderboardData(),
        getAllVoteLeaderboardData(),
      ])

      return { clipData, voteData }
    },
    1 * TimeUnits.HOUR,
    10 * TimeUnits.MINUTE // One big computation every hour
  )()
}

//
// Clips
//

// Extract global clip leaderboard from cached data
const getGlobalClipLeaderboard = () => {
  return lazyCache(
    'cv:leaderboard:clip-global',
    async () => {
      const { clipData } = await getAllLeaderboardData()

      // Aggregate across all locales
      const userTotals = new Map()
      for (const row of clipData) {
        const key = row.client_id
        if (!userTotals.has(key)) {
          userTotals.set(key, { ...row, total: 0 })
        }
        userTotals.get(key).total += row.total
      }

      const leaderboard = Array.from(userTotals.values()).sort(
        (a, b) => b.total - a.total
      )

      return leaderboard.map((row, i) => ({ position: i, ...row }))
    },
    1 * TimeUnits.HOUR,
    5 * TimeUnits.SECOND // Fast memory processing
  )()
}

// Extract per-locale from cached data
const getLocaleClipLeaderboard = (locale: string) => {
  return lazyCache(
    `cv:leaderboard:clip-${locale}`,
    async () => {
      const { clipData } = await getAllLeaderboardData()
      const localeId = await getLocaleId(locale)

      // Filter by locale and aggregate per user
      const userTotals = new Map()
      for (const row of clipData) {
        if (row.locale_id !== localeId) continue

        const key = row.client_id
        if (!userTotals.has(key)) {
          userTotals.set(key, { ...row, total: 0 })
        }
        userTotals.get(key).total += row.total
      }

      const leaderboard = Array.from(userTotals.values()).sort(
        (a, b) => b.total - a.total
      )

      return leaderboard.map((row, i) => ({ position: i, ...row }))
    },
    1 * TimeUnits.HOUR,
    5 * TimeUnits.SECOND // Fast memory processing
  )()
}

//
// Votes
//

// Extract global vote leaderboard from cached data
const getGlobalVoteLeaderboard = () => {
  return lazyCache(
    'cv:leaderboard:vote-global',
    async () => {
      const { voteData } = await getAllLeaderboardData()

      const userTotals = new Map()
      for (const row of voteData) {
        const key = row.client_id
        if (!userTotals.has(key)) {
          userTotals.set(key, { ...row, total: 0 })
        }
        userTotals.get(key).total += row.total
      }

      const leaderboard = Array.from(userTotals.values()).sort(
        (a, b) => b.total - a.total
      )

      return leaderboard.map((row, i) => ({ position: i, ...row }))
    },
    2 * TimeUnits.HOUR,
    5 * TimeUnits.SECOND
  )()
}

// Extract per-locale vote leaderboard from cached data
const getLocaleVoteLeaderboard = (locale: string) => {
  return lazyCache(
    `cv:leaderboard:vote-${locale}`,
    async () => {
      const { voteData } = await getAllLeaderboardData()
      const localeId = await getLocaleId(locale)

      const userTotals = new Map()
      for (const row of voteData) {
        if (row.locale_id !== localeId) continue

        const key = row.client_id
        if (!userTotals.has(key)) {
          userTotals.set(key, { ...row, total: 0 })
        }
        userTotals.get(key).total += row.total
      }

      const leaderboard = Array.from(userTotals.values()).sort(
        (a, b) => b.total - a.total
      )

      return leaderboard.map((row, i) => ({ position: i, ...row }))
    },
    2 * TimeUnits.HOUR,
    5 * TimeUnits.SECOND
  )()
}

// KEEP OLD IMPLEMENTATION FOR NOW

// async function getClipLeaderboard(locale?: string): Promise<any[]> {
//   const params: { locale_id?: number } = {}
//   let localeCondition = ''
//   if (locale) {
//     localeCondition = 'AND clips.locale_id = :locale_id'
//     params.locale_id = await getLocaleId(locale) // Only add param if needed
//   }

//   const query = `
//     SELECT user_clients.client_id,
//             avatar_url,
//             avatar_clip_url,
//             username,
//             COUNT(clips.id) AS total
//       FROM user_clients
//       LEFT JOIN clips ON user_clients.client_id = clips.client_id
//           WHERE visible = 1
//           ${localeCondition}
//       GROUP BY client_id
//         HAVING total > 0
//       ORDER BY total DESC
//     `

//   const [rows] = await db.query(query, params)
//   return rows
// }

// async function getVoteLeaderboard(locale?: string): Promise<any[]> {
//   const params: { locale_id?: number } = {}
//   let localeCondition = ''
//   if (locale) {
//     localeCondition = 'AND clips.locale_id = :locale_id'
//     params.locale_id = await getLocaleId(locale) // Only add param if needed
//   }
//   const query = `
//     SELECT user_clients.client_id,
//            avatar_url,
//            avatar_clip_url,
//            username,
//            count(votes.id) as total
//     FROM user_clients
//     LEFT JOIN votes ON user_clients.client_id = votes.client_id
//     LEFT JOIN clips ON votes.clip_id = clips.id
//         WHERE visible = 1
//         ${localeCondition}
//     GROUP BY client_id
//       HAVING total > 0
//     ORDER BY total DESC
//   `
//   const [rows] = await db.query(query, params)
//   return rows
// }

// const getFullClipLeaderboard = (locale?: string) => {
//   const lockTtl = locale
//     ? 60 * TimeUnits.SECOND // With locale - avg. measured 5 sec - worst 1.1 min!!! => dropped from 80 with added indexes
//     : 3 * TimeUnits.MINUTE // Without locale - avg. measured 2.1 min - worst 4.7!!! => dropped from 5 with added indexes
//   const cacheTtl = locale
//     ? 1 * TimeUnits.HOUR // With locale
//     : 2 * TimeUnits.HOUR // Without locale

//   return lazyCache(
//     `clip-leaderboard-${locale || 'global'}`,
//     async () => {
//       const leaderboard = await getClipLeaderboard(locale)
//       return leaderboard.map((row, i) => ({ position: i, ...row }))
//     },
//     cacheTtl,
//     lockTtl
//   )()
// }

// const getFullVoteLeaderboard = (locale?: string) => {
//   const lockTtl = locale
//     ? 3 * TimeUnits.MINUTE // With locale - avg. measured 21.2 sec - worst 3.5 min!!! => dropped from 4 with added indexes
//     : 6 * TimeUnits.MINUTE // Without locale - avg. measured 8.4 min - worst 17.1 min!!! => dropped from 20 with added indexes
//   const cacheTtl = locale
//     ? 1 * TimeUnits.HOUR // With locale
//     : 2 * TimeUnits.HOUR // Without locale

//   return lazyCache(
//     `vote-leaderboard-${locale || 'global'}`,
//     async () => {
//       const leaderboard = await getVoteLeaderboard(locale)
//       return leaderboard.map((row, i) => ({ position: i, ...row }))
//     },
//     cacheTtl,
//     lockTtl
//   )()
// }

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
  )
  return rows
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
  )
  return rows
}

// this SQL is in low quality, but it does the job: showing all teams' rankings across 3 weeks.
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
                    SUM(((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 1, challenges.start_date) AND achievements.week IS NULL) OR achievements.week <= 1) * points) AS w1_points,
                    SUM(((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 2, challenges.start_date) AND achievements.week IS NULL) OR achievements.week <= 2) * points) AS w2_points,
                    SUM(((earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date) AND achievements.week IS NULL) OR achievements.week <= 3) * points) AS w3_points
                FROM challenges
                LEFT JOIN teams ON challenges.id = teams.challenge_id
                LEFT JOIN earn ON earn.team_id = teams.id
                    AND earn.client_id IS NULL
                    AND earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 4, challenges.start_date)
                LEFT JOIN achievements ON achievements.id = earn.achievement_id
                    AND achievements.challenge_id = challenges.id
                WHERE challenges.url_token = ?
                GROUP BY teams.id, teams.name
                ORDER BY w1_points DESC
            ) teams, (SELECT @cur1 :=0, @point1 := NULL, @next1 := 1) r
            GROUP BY id
            ORDER BY w2_points DESC
        ) teams, (SELECT @cur2 :=0, @point2 := NULL, @next2 := 1) r
        GROUP BY id
        ORDER BY w3_points DESC
    ) teams, (SELECT @cur3 :=0, @point3 := NULL, @next3 := 1) r
    `,
    [challenge]
  )
  return rows
}

export const getTopSpeakersLeaderboard = lazyCache(
  'top-speaker-leaderboard',
  async ({
    client_id,
    challenge,
    locale,
    team_only,
  }: ChallengeLeaderboardArgument) => {
    return (
      await getTopSpeakers({
        client_id,
        challenge,
        locale,
        team_only,
      })
    ).map((row, i) => ({
      position: i,
      ...row,
    }))
  },
  1 * TimeUnits.HOUR,
  10 * TimeUnits.MINUTE
)

export const getTopListenersLeaderboard = lazyCache(
  'top-listener-leaderboard',
  async ({
    client_id,
    challenge,
    locale,
    team_only,
  }: ChallengeLeaderboardArgument) => {
    return (
      await getTopListeners({
        client_id,
        challenge,
        locale,
        team_only,
      })
    ).map((row, i) => ({
      position: i,
      ...row,
    }))
  },
  1 * TimeUnits.HOUR,
  10 * TimeUnits.MINUTE
)

export const getTopTeamsLeaderboard = lazyCache(
  'top-teams-leaderboard',
  async (challenge: ChallengeToken) => {
    return (await getTopTeams(challenge)).map((row, i) => ({
      position: i,
      ...row,
      // Cast computed points and rankings from strings to numbers.
      w1: Number(row.w1),
      w2: Number(row.w2),
      w3: Number(row.w3),
      w1_points: Number(row.w1_points),
      w2_points: Number(row.w2_points),
      w3_points: Number(row.w3_points),
    }))
  },
  1 * TimeUnits.HOUR,
  10 * TimeUnits.MINUTE
)

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
  dashboard: 'stats' | 'challenge'
  type?: 'clip' | 'vote'
  client_id: string
  cursor?: [number, number]
  locale: string
  arg?: any
}) {
  const prepareRows = (rows: any[]) =>
    rows.map(row => {
      const { client_id: row_client_id, avatar_clip_url, ...result } = row
      return {
        ...result,
        avatarClipUrl: avatar_clip_url
          ? bucket.getAvatarClipsUrl(avatar_clip_url)
          : null,
        clientHash: SHA256(row_client_id + getConfig().SECRET).toString(),
        you: row_client_id == client_id,
      }
    })

  let leaderboard = []
  if (dashboard == 'stats') {
    // OLD VERSION - KEEP FOR NOW
    // leaderboard = await (type == 'clip'
    //   ? getFullClipLeaderboard
    //   : getFullVoteLeaderboard)(locale)
    leaderboard = await (type == 'clip'
      ? locale
        ? getLocaleClipLeaderboard(locale)
        : getGlobalClipLeaderboard()
      : locale
      ? getLocaleVoteLeaderboard(locale)
      : getGlobalVoteLeaderboard())
  } else if (dashboard == 'challenge') {
    const { scope, challenge } = arg
    switch (scope) {
      case 'contributors':
        leaderboard = await (type == 'clip'
          ? getTopSpeakersLeaderboard
          : getTopListenersLeaderboard)({
          client_id,
          challenge,
          locale,
          team_only: false,
        })
        break
      case 'members':
        leaderboard = await (type == 'clip'
          ? getTopSpeakersLeaderboard
          : getTopListenersLeaderboard)({
          client_id,
          challenge,
          locale,
          team_only: true,
        })
        break
      case 'teams':
        leaderboard = await getTopTeamsLeaderboard(challenge)
        break
    }
  }

  if (cursor) {
    return prepareRows(leaderboard.slice(cursor[0], cursor[1]))
  }

  if (!leaderboard || leaderboard?.length < 5) leaderboard = []

  const userIndex = leaderboard.findIndex(row => row.client_id == client_id)
  const userRegion =
    userIndex == -1 ? [] : leaderboard.slice(userIndex - 1, userIndex + 2)
  const partialBoard = [
    ...leaderboard.slice(0, 10 + Math.max(0, 10 - userRegion.length)),
    ...userRegion,
  ]
  return prepareRows(
    partialBoard.filter(
      ({ position }, i) =>
        i == partialBoard.findIndex(row => row.position == position)
    )
  )
}
