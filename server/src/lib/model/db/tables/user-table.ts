import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const NAME = 'users';

const UserSchema: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    email: 'varchar(255) unique',
  },
  indexes: null,
};

const VERSIONS: SchemaVersions = {
  1: UserSchema,
};

/**
 * Handles transactions with the user table.
 */
export default class UserTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }

  /**
   * Update and Insert user record.
   */
  async update(email: string): Promise<void> {
    if (!email) {
      return;
    }

    await this.mysql.upsert(NAME, ['email'], [email]);
  }
}
