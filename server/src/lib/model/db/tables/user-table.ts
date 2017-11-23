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

export interface UpdatableUserFields {
  email?: string;
  send_emails?: boolean;
  has_downloaded?: boolean;
}

/**
 * Handles transactions with the user table.
 */
export class UserTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }

  /**
   * Update and Insert user record.
   */
  async update(fields: UpdatableUserFields): Promise<void> {
    const [columns, values] = Object.entries(fields).reduce(
      ([columns, values], [column, value]) => [
        columns.concat(column),
        values.concat(typeof value == 'boolean' ? Number(value) : value),
      ],
      [[], []]
    );
    await this.mysql.upsert(NAME, columns, values);
    const [
      [user],
    ] = await this.mysql.exec(`SELECT * FROM ${NAME} WHERE email = ?`, [
      fields.email,
    ]);
    console.log('DB --', 'User', JSON.stringify(user, null, 2));
  }
}
