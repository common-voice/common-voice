import Mysql from '../mysql';
import { default as Table } from '../table';

/**
 * Handles transactions with the user table.
 */
export class UserTable extends Table {
  constructor(mysql: Mysql) {
    super('users', mysql);
  }

  /**
   * Update and Insert user record.
   */
  async update(fields: any): Promise<void> {
    await super.update(fields);
    const [[user]] = await this.mysql.query(
      `SELECT * FROM ${this.getName()} WHERE email = ?`,
      [fields.email]
    );
    console.log('DB --', 'User', JSON.stringify(user, null, 2));
  }
}
