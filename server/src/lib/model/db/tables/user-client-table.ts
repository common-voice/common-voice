import Mysql from '../mysql';
import {
  IndexTypeValues,
  TableSchema,
  SchemaVersions,
  default as Table,
} from '../table';

const NAME = 'user_clients';

const UserSchema: TableSchema = {
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

const VERSIONS: SchemaVersions = {
  2: UserSchema,
};

/**
 * Trackers email to clientid associations.
 */
export default class UserClientTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }

  async update(clientId: string, email?: string): Promise<void> {
    await this.mysql.upsert(NAME, ['client_id', 'email'], [clientId, email]);
  }
}
