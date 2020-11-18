import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function scrubUserActivity() {
  await db.query(`
    DELETE FROM user_client_activities
    WHERE created_at <
      (CURDATE() - INTERVAL 7 DAY)`);
}
