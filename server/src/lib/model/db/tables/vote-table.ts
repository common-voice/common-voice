import Mysql from '../mysql';
import {
  IndexTypeValues,
  TableSchema,
  SchemaVersions,
  default as Table,
} from '../table';

const VotesSchema: TableSchema = {
  name: 'votes',
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    clip_id: 'BIGINT UNSIGNED NOT NULL',
    is_valid: 'BOOLEAN NOT NULL',
    sentence: Table.FLAG_TYPE,
    client_id: Table.CLIENTID_TYPE,
  },

  indexes: [
    {
      name: 'clip_client_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['clip_id', 'client_id'],
    },
  ],
  foreignKeys: [
    {
      targetTable: 'user_clients',
      columns: {
        client_id: 'client_id',
      },
    },
    {
      targetTable: 'user_clients',
      columns: {
        client_id: 'client_id',
      },
    },
  ],
};

const VERSIONS: SchemaVersions = {
  6: VotesSchema,
};

export default class VotesTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
