import Mysql from '../mysql';
import { default as Table } from '../table';

export interface UpdatableUserFields {
  email?: string;
  send_emails?: boolean;
  has_downloaded?: boolean;
}

/**
 * Handles transactions with the user table.
 */
export class UserTable extends Table<UpdatableUserFields> {
  constructor(mysql: Mysql) {
    super('users', mysql);
  }

  /**
   * Update and Insert user record.
   */
  async update(fields: UpdatableUserFields): Promise<void> {
    await super.update(fields);
    const [[user]] = await this.mysql.query(
      `SELECT * FROM ${this.getName()} WHERE email = ?`,
      [fields.email]
    );
    console.log('DB --', 'User', JSON.stringify(user, null, 2));
  }
}
