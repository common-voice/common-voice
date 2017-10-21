import Mysql from './mysql';
import { TableSchema, SchemaVersions, default as Table } from './table';

const NAME = 'users';

const UserSchema: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    email: 'varchar(200) unique',
    birthyear: 'smallint',
    accent: 'varchar(100)',
    gender: 'varchar(1)',
    name: 'varchar(50)',
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
}
