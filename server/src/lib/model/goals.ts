import { getLocaleId } from './db';
import { getMySQLInstance } from './db/mysql';

const STREAK_THRESHOLDS = [1, 3, 5, 10, 15];

const THRESHOLDS = [5, 20, 50, 100, 150];

const db = getMySQLInstance();

const ONE_DAY = 24 * 60 * 60 * 1000;
const daysBetween = (date1: Date, date2: Date) =>
  Math.floor((date1.getTime() - date2.getTime()) / ONE_DAY);

export default async function getGoals(client_id: string, locale?: string) {
  const [rows] = await db.query(
    `
      SELECT type, created_at
      FROM (
        SELECT client_id, created_at, 'clip' AS type
        FROM clips
        ${locale ? 'WHERE locale_id = :locale_id' : ''}
        UNION SELECT votes.client_id, votes.created_at, 'vote' AS type
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
        ${locale ? 'WHERE locale_id = :locale_id' : ''}
      ) dates
      WHERE client_id = :client_id
      ORDER BY created_at ASC
    `,
    {
      client_id,
      locale_id: locale ? await getLocaleId(locale) : null,
    }
  );

  let streakDates: string[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const dateTime1 = new Date(rows[i].created_at);
    let lastDateTime;
    for (let j = i + 1; j < rows.length; j++) {
      const dateTime2 = new Date(rows[j].created_at);

      const streakDays = daysBetween(dateTime2, dateTime1);
      if (lastDateTime && daysBetween(dateTime2, lastDateTime) >= 1) {
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
    streaks: STREAK_THRESHOLDS.map((goal, i) => ({
      goal,
      date: streakDates[i] || null,
    })),
    clips: THRESHOLDS.map((goal, i) => ({
      goal,
      date: clipGoalDates[i] || null,
    })),
    votes: THRESHOLDS.map((goal, i) => ({
      goal,
      date: voteGoalDates[i] || null,
    })),
  };
}
