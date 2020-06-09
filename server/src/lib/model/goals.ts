import { AllGoals } from 'common';
import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';
import { earnBonus } from './achievements';

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

const formatDate = (date: Date) =>
  date.toISOString().slice(0, 19).replace('T', ' ');

async function hasComputedGoals(client_id: string) {
  const [
    [client],
  ] = await db.query(
    'SELECT has_computed_goals FROM user_clients WHERE client_id = ?',
    [client_id]
  );
  return Boolean(client?.has_computed_goals);
}

export async function computeGoals(client_id: string): Promise<any> {
  if (await hasComputedGoals(client_id)) return;

  await db.query('DELETE FROM reached_goals WHERE client_id = ?', [client_id]);

  const [rows] = await db.query(
    `
      SELECT locale_id, type, created_at
      FROM (
        SELECT locale_id, created_at, 'clip' AS type
        FROM clips
        WHERE client_id = :client_id
        UNION ALL
        SELECT locale_id, votes.created_at, 'vote' AS type
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
        WHERE votes.client_id = :client_id
      ) dates
      ORDER BY created_at ASC
    `,
    { client_id }
  );

  const localeStreakMap = new Map();
  const countsMap = new Map();
  for (const { locale_id, type, created_at } of rows) {
    let counts = countsMap.get(locale_id);
    if (!counts) {
      counts = { clips: 0, votes: 0 };
      countsMap.set(locale_id, counts);
    }

    const isClip = type == 'clip';
    const count = isClip ? (counts.clips += 1) : (counts.votes += 1);
    if (THRESHOLDS.some(t => t == count)) {
      await db.query(
        `
          INSERT INTO reached_goals
          (type, client_id, locale_id, count, reached_at)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE reached_at = VALUES(reached_at)
        `,
        [
          isClip ? 'clips' : 'votes',
          client_id,
          locale_id,
          count,
          formatDate(new Date(created_at)),
        ]
      );
    }

    let streak = localeStreakMap.get(locale_id);
    if (!streak) {
      streak = {
        startedAt: null,
        lastActivityAt: null,
      };
      localeStreakMap.set(locale_id, streak);
    }

    const contributionAt = new Date(created_at);
    const daysSinceLastActivity = streak.lastActivityAt
      ? daysBetween(contributionAt, streak.lastActivityAt)
      : 0;
    if (!streak.startedAt) {
      streak.startedAt = streak.lastActivityAt = contributionAt;
    } else if (daysSinceLastActivity <= 1) {
      streak.lastActivityAt = contributionAt;

      const streakDays = daysBetween(contributionAt, streak.startedAt);
      if (STREAK_THRESHOLDS.some(t => t == streakDays)) {
        await db.query(
          `
            INSERT IGNORE INTO reached_goals
              (type, client_id, locale_id, count, reached_at
            )
            VALUES (?, ?, ?, ?, ?)
          `,
          [
            'streak',
            client_id,
            locale_id,
            streakDays,
            formatDate(contributionAt),
          ]
        );
      }
    }
  }

  const now = new Date();
  for (const [
    locale_id,
    { startedAt, lastActivityAt },
  ] of localeStreakMap.entries()) {
    if (daysBetween(now, lastActivityAt) > 1) {
      continue;
    }
    await db.query(
      `
        INSERT INTO streaks
        (client_id, locale_id, started_at, last_activity_at)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          started_at = VALUES(started_at),
          last_activity_at = VALUES(last_activity_at)
        `,
      [client_id, locale_id, formatDate(startedAt), formatDate(lastActivityAt)]
    );
  }

  await db.query(
    'UPDATE user_clients SET has_computed_goals = true WHERE client_id = ?',
    [client_id]
  );
}

export default async function getGoals(
  client_id: string,
  locale?: string
): Promise<AllGoals['globalGoals']> {
  await computeGoals(client_id);

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
  if (!(await hasComputedGoals(client_id))) return;

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
