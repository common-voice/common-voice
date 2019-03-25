import pick = require('lodash.pick');
import { getMySQLInstance } from './db/mysql';
import CustomGoal from './custom-goal';

const db = getMySQLInstance();

export default {
  async checkProgress(client_id: string) {
    const goal = await CustomGoal.find(client_id);

    if (!goal) return;
    const isReached = Object.values(goal.current).every(v => v >= goal.amount);
    if (!isReached) return;

    const intervalStart = new Date(goal.current_interval_start)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const [[hasAwardAlready]] = await db.query(
      `
        SELECT *
        FROM awards
        WHERE custom_goal_id = ? AND goal_interval_start = TIMESTAMP(?)
      `,
      [goal.id, intervalStart]
    );
    if (hasAwardAlready) return;

    await db.query(
      `
        INSERT INTO awards (client_id, custom_goal_id, goal_interval_start)
        VALUES (?, ?, TIMESTAMP(?)) 
      `,
      [client_id, goal.id, intervalStart]
    );
  },

  async find(client_id: string) {
    const [rows] = await db.query(
      `
        SELECT *
        FROM awards
        LEFT JOIN custom_goals ON awards.custom_goal_id = custom_goals.id
        WHERE awards.client_id = ?
      `,
      [client_id]
    );
    return rows.map((row: any) =>
      pick(row, 'seen_at', 'type', 'days_interval', 'amount')
    );
  },

  async seen(client_id: string) {
    await db.query(
      `
        UPDATE awards
        SET seen_at = now()
        WHERE seen_at IS NULL AND client_id = ?
      `,
      [client_id]
    );
  },
};
