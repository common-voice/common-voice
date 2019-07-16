import { AllGoals } from 'common/goals';
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';

const STREAK_THRESHOLDS = [1, 3, 5, 10, 15];

const THRESHOLDS = [5, 20, 50, 100, 150];

const db = getMySQLInstance();

function findGoal(goals: any[], type: string, threshold: number) {
  const goal = goals.find(g => g.type == type && g.count == threshold);
  return goal ? goal.reached_at : null;
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const daysBetween = (date1: Date, date2: Date) =>
  Math.floor((date1.getTime() - date2.getTime()) / ONE_DAY);

export default async function getGoals(
  client_id: string,
  locale?: string
): Promise<AllGoals['globalGoals']> {
  const [rows] = await db.query(
    `
      SELECT type, created_at
      FROM (
        SELECT client_id, created_at, 'clip' AS type
        FROM clips
        WHERE client_id = :client_id
        ${locale ? 'AND locale_id = :locale_id' : ''}
        UNION ALL
        SELECT votes.client_id, votes.created_at, 'vote' AS type
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
        WHERE votes.client_id = :client_id
        ${locale ? 'AND locale_id = :locale_id' : ''}
      ) dates
      ORDER BY created_at ASC
    `,
    {
      client_id,
      locale_id: locale ? await getLocaleId(locale) : null,
    }
  );

  let maxStreak = 0;
  let streakDates: string[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const dateTime1 = new Date(rows[i].created_at);
    let lastDateTime = dateTime1;
    for (let j = i + 1; j < rows.length; j++) {
      const dateTime2 = new Date(rows[j].created_at);

      const streakDays = daysBetween(dateTime2, dateTime1);
      maxStreak = Math.max(maxStreak, streakDays);
      if (daysBetween(dateTime2, lastDateTime) >= 1) {
        break;
      } else if (streakDays >= STREAK_THRESHOLDS[streakDates.length]) {
        streakDates.push(dateTime2.toISOString());
      }
      lastDateTime = dateTime2;
    }
  }

  let clipCount = 0;
  let clipGoalDates: string[] = [];

  let voteCount = 0;
  let voteGoalDates: string[] = [];

  for (const { type, created_at } of rows) {
    clipCount += type == 'clip' ? 1 : 0;
    if (clipCount >= THRESHOLDS[clipGoalDates.length]) {
      clipGoalDates.push(new Date(created_at).toISOString());
    }

    voteCount += type == 'vote' ? 1 : 0;
    if (voteCount >= THRESHOLDS[voteGoalDates.length]) {
      voteGoalDates.push(new Date(created_at).toISOString());
    }
  }

  return {
    streaks: [
      maxStreak,
      STREAK_THRESHOLDS.map((goal, i) => ({
        goal,
        date: streakDates[i] || null,
      })),
    ],
    clips: [
      clipCount,
      THRESHOLDS.map((goal, i) => ({
        goal,
        date: clipGoalDates[i] || null,
      })),
    ],
    votes: [
      voteCount,
      THRESHOLDS.map((goal, i) => ({
        goal,
        date: voteGoalDates[i] || null,
      })),
    ],
  };
}

export async function getGoalsNew(
  client_id: string,
  locale?: string
): Promise<AllGoals['globalGoals']> {
  const localeId = locale ? await getLocaleId(locale) : null;
  const [[reachedGoals], [[counts]]] = await Promise.all([
    db.query(
      `
        SELECT *
        FROM reached_goals
        WHERE client_id = :client_id
          ${locale ? 'AND locale_id = :locale_id' : ''}
      `,
      {
        client_id,
        locale_id: localeId,
      }
    ),
    db.query(
      `
        SELECT
          (
            SELECT COUNT(*) AS count
            FROM clips
            WHERE client_id = :client_id
              ${locale ? 'AND locale_id = :locale_id' : ''}
            ORDER BY count DESC
            LIMIT 1
          ) AS clips,
          (
            SELECT COUNT(*) AS count
            FROM votes
            LEFT JOIN clips ON votes.clip_id = clips.id
            WHERE votes.client_id = :client_id
              ${locale ? 'AND clips.locale_id = :locale_id' : ''}
            ORDER BY count DESC
            LIMIT 1
          ) AS votes,
          (
            SELECT DATEDIFF(last_activity_at, started_at) AS streak
            FROM streaks
            WHERE client_id = :client_id
              ${locale ? 'AND locale_id = :locale_id' : ''}
            ORDER BY streak DESC
            LIMIT 1
          ) AS streak
      `,
      {
        client_id,
        locale_id: localeId,
      }
    ),
  ]);

  return {
    streaks: [
      counts.streak,
      STREAK_THRESHOLDS.map(threshold => ({
        goal: threshold,
        date: findGoal(reachedGoals, 'streak', threshold),
      })),
    ],
    clips: [
      counts.clips,
      THRESHOLDS.map(threshold => ({
        goal: threshold,
        date: findGoal(reachedGoals, 'clips', threshold),
      })),
    ],
    votes: [
      counts.votes,
      THRESHOLDS.map(threshold => ({
        goal: threshold,
        date: findGoal(reachedGoals, 'votes', threshold),
      })),
    ],
  };
}

/**
 * Checks whether goals are reached and if so creates reached_goals DB rows.
 * Also includes streaks which requires checking and updating the streaks table,
 * so the expectation is that it's called after a contribution (speak/listen).
 */
export async function checkGoalsAfterContribution(
  client_id: string,
  locale: { id: number } | { name: string }
) {
  const localeId =
    'name' in locale ? await getLocaleId(locale.name) : locale.id;
  let [
    [reachedGoals],
    [[{ clips_count, votes_count }]],
    [[streak]],
  ] = await Promise.all([
    db.query(
      'SELECT * FROM reached_goals WHERE client_id = ? AND locale_id = ?',
      [client_id, localeId]
    ),
    db.query(
      `
        SELECT 
          (
           SELECT COUNT(*)
           FROM clips
           WHERE client_id = :client_id AND locale_id = :locale_id
          ) AS clips_count,
          (
           SELECT COUNT(*)
           FROM votes
           LEFT JOIN clips ON votes.clip_id = clips.id
           WHERE votes.client_id = :client_id AND clips.locale_id = :locale_id
          ) AS votes_count
      `,
      { client_id, locale_id: localeId }
    ),
    db.query(
      `
        SELECT DATEDIFF(now(), last_activity_at) AS days_since
        FROM streaks
        WHERE client_id = ? AND locale_id = ?
      `,
      [client_id, localeId]
    ),
  ]);

  if (!streak) {
    await db.query(
      `
        INSERT INTO streaks (client_id, locale_id, started_at, last_activity_at)
        VALUES (?, ?, NOW(), NOW())
      `,
      [client_id, localeId]
    );
  } else if (streak.days_since <= 1) {
    await db.query(
      `
        UPDATE streaks
        SET last_activity_at = NOW()
        WHERE client_id = ? AND locale_id = ?
      `,
      [client_id, localeId]
    );
  } else {
    await db.query(
      `
        UPDATE streaks
        SET started_at = NOW(), last_activity_at = NOW()
        WHERE client_id = ? AND locale_id = ?
      `,
      [client_id, localeId]
    );
  }

  const [[{ streak_days }]] = await db.query(
    `
        SELECT DATEDIFF(NOW(), started_at) AS streak_days
        FROM streaks
        WHERE client_id = ? AND locale_id = ?
    `,
    [client_id, localeId]
  );
  for (const type of ['streak', 'clips', 'votes']) {
    const maxCount = reachedGoals.reduce(
      (max: number, row: any) =>
        row.type == type && row.count > max ? row.count : max,
      0
    );
    const threshold = (type == 'streak' ? STREAK_THRESHOLDS : THRESHOLDS).find(
      t => t > maxCount
    );
    const currentCount = ({
      streak: streak_days,
      clips: clips_count,
      votes: votes_count,
    } as any)[type];

    if (!threshold || currentCount < threshold) {
      continue;
    }

    await db.query(
      `
        INSERT IGNORE INTO reached_goals
               (count, type, client_id, locale_id, reached_at)
        VALUES (?,     ?,    ?,         ?,         NOW()     )`,
      [threshold, type, client_id, localeId]
    );
  }
}
