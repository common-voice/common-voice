import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const NAME = 'users';

const UserSchema_V3: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    email: 'varchar(255) unique',
    send_emails: Table.FLAG_TYPE,
    has_downloaded: Table.FLAG_TYPE,
  },
  indexes: null,
};

const UserSchema_V1: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    email: 'varchar(255) unique',
  },
  indexes: null,
};

const VERSIONS: SchemaVersions = {
  1: UserSchema_V1,
  3: UserSchema_V3,
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
