import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

export default {
  async findAll({ client_id, email }: { client_id: string; email: string }) {
    const [rows] = await db.query(
      `
        SELECT *
        FROM user_clients
        WHERE client_id = ? OR email = ?
      `,
      [client_id || null, email || null]
    );
    return rows;
  },
};
