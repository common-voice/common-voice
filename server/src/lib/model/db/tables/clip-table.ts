import Mysql from '../mysql';
import {
  IndexTypeValues,
  TableSchema,
  SchemaVersions,
  default as Table,
} from '../table';

const NAME = 'clips';

const ClipSchema: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    client_id: Table.CLIENTID_TYPE,
    path: 'varchar(255) NOT NULL',
    sentence: 'varchar(255) NOT NULL',
    original_sentence_id: 'bigint(255) UNSIGNED NOT NULL',
  },

  indexes: [
    {
      name: 'client_sentence_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['client_id', 'original_sentence_id'],
    },
  ],
  foreignKeys: [
    {
      targetTable: 'sentences',
      columns: {
        original_sentence_id: 'id',
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
  5: ClipSchema,
};

export default class ClipsTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
