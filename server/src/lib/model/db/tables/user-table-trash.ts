import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const NAME = 'users';

const UserSchema_V2: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    email: Table.EMAIL_TYPE + ' unique',
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
  2: UserSchema_V2,
};

/**
 * Handles transactions with the user table.
 */
export default class UserTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
