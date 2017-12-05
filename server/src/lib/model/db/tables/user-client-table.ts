import Mysql from '../mysql';
import {
  IndexTypeValues,
  TableSchema,
  SchemaVersions,
  default as Table,
} from '../table';

const NAME = 'user_clients';

const UserClientSchema_V2: TableSchema = {
  name: NAME,
  columns: {
    client_id: Table.CLIENTID_TYPE + ' primary key',
    email: Table.EMAIL_TYPE,
  },

  // We have a covering index, and access by email.
  indexes: [
    {
      name: 'full_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['client_id', 'email'],
    },
    {
      name: 'email_index',
      type: IndexTypeValues.INDEX,
      columns: ['email'],
    },
  ],
};

const UserClientSchema: TableSchema = {
  name: NAME,
  columns: {
    client_id: Table.CLIENTID_TYPE + ' primary key',
    email: Table.EMAIL_TYPE,
    accent: 'varchar(255)',
    age: 'varchar(255)',
    gender: 'varchar(255)',
  },

  // We have a covering index, and access by email.
  indexes: [
    {
      name: 'full_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['client_id', 'email'],
    },
    {
      name: 'email_index',
      type: IndexTypeValues.INDEX,
      columns: ['email'],
    },
  ],
};

const VERSIONS: SchemaVersions = {
  2: UserClientSchema_V2,
  7: UserClientSchema,
};

/**
 * Trackers email to clientid associations.
 */
export default class UserClientTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
