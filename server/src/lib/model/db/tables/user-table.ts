import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as BaseTable } from '../table';

const NAME = 'users';

const UserSchema_V3: TableSchema = {
  name: NAME,
  columns: {
    id: BaseTable.PRIMARY_KEY_TYPE,
    email: 'varchar(255) unique',
    send_emails: BaseTable.FLAG_TYPE,
    has_downloaded: BaseTable.FLAG_TYPE,
  },
  indexes: null,
};

const UserSchema_V1: TableSchema = {
  name: NAME,
  columns: {
    id: BaseTable.PRIMARY_KEY_TYPE,
    email: 'varchar(255) unique',
  },
  indexes: null,
};

const VERSIONS: SchemaVersions = {
  1: UserSchema_V1,
  3: UserSchema_V3,
};

export namespace User {
  export interface UpdatableFields {
    email?: string;
    send_emails?: boolean;
    has_downloaded?: boolean;
  }

  /**
   * Handles transactions with the user table.
   */
  export class Table extends BaseTable {
    constructor(mysql: Mysql) {
      super(mysql, VERSIONS);
    }

    /**
     * Update and Insert user record.
     */
    async update(fields: UpdatableFields): Promise<void> {
      const [columns, values] = Object.entries(fields).reduce(
        ([columns, values], [column, value]) => [
          columns.concat(column),
          values.concat(typeof value == 'boolean' ? Number(value) : value),
        ],
        [[], []]
      );
      await this.mysql.upsert(NAME, columns, values);
    }
  }
}
