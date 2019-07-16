const STREAK_THRESHOLDS = [1, 3, 5, 10, 15];
const THRESHOLDS = [5, 20, 50, 100, 150];

const ONE_DAY = 24 * 60 * 60 * 1000;
const daysBetween = (date1: Date, date2: Date) =>
  Math.floor((date1.getTime() - date2.getTime()) / ONE_DAY);

const format = (date: Date) =>
  date
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

export const up = async function(db: any): Promise<any> {
  const runSql = (db: any, query: any, params: any) =>
    new Promise((resolve, reject) => {
      db.runSql(query, params, (err: any, data: any) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

  const rows = await db.runSql(
    `
      SELECT client_id, locale_id, type, created_at
      FROM (
        SELECT client_id, locale_id, created_at, 'clip' AS type
        FROM clips
        UNION ALL
        SELECT votes.client_id, locale_id, votes.created_at, 'vote' AS type
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
      ) dates
      ORDER BY created_at ASC
    `
  );

  {
    const clientLocaleStreakMap = new Map();
    for (const { client_id, locale_id, created_at } of rows) {
      const key = JSON.stringify([locale_id, client_id]);
      let streak = clientLocaleStreakMap.get(key);
      if (!streak) {
        streak = {
          startedAt: null,
          lastActivityAt: null,
        };
        clientLocaleStreakMap.set(key, streak);
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
        if (!STREAK_THRESHOLDS.some(t => t == streakDays)) {
          continue;
        }
        await runSql(
          db,
          `
            INSERT IGNORE INTO reached_goals
              (type, client_id, locale_id, count, reached_at
            )
            VALUES (?, ?, ?, ?, ?)
          `,
          ['streak', client_id, locale_id, streakDays, format(contributionAt)]
        );
      }
    }

    const now = new Date();
    for (const [
      key,
      { startedAt, lastActivityAt },
    ] of clientLocaleStreakMap.entries()) {
      if (daysBetween(now, lastActivityAt) > 1) {
        continue;
      }

      const [locale_id, client_id] = JSON.parse(key);
      await runSql(
        db,
        `
          INSERT INTO streaks
          (client_id, locale_id, started_at, last_activity_at)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            started_at = VALUES(started_at),
            last_activity_at = VALUES(last_activity_at)
        `,
        [client_id, locale_id, format(startedAt), format(lastActivityAt)]
      );
    }
  }

  {
    const clientCountsMap = new Map();
    for (const { client_id, locale_id, type, created_at } of rows) {
      const key = JSON.stringify([locale_id, client_id]);
      let counts = clientCountsMap.get(key);
      if (!counts) {
        counts = { clips: 0, votes: 0 };
        clientCountsMap.set(key, counts);
      }

      const isClip = type == 'clip';
      const count = isClip ? (counts.clips += 1) : (counts.votes += 1);
      if (!THRESHOLDS.some(t => t == count)) {
        continue;
      }
      await runSql(
        db,
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
          format(new Date(created_at)),
        ]
      );
    }
  }
};

export const down = function(): Promise<any> {
  return null;
};
