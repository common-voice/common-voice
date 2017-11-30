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
    client_id: Table.CLIENTID_TYPE + ' NOT NULL',
    path: 'varchar(255) NOT NULL',
    sentence: 'TEXT CHARACTER SET utf8 NOT NULL',
    original_sentence_id: 'varchar(255) NOT NULL',
  },

  indexes: [
    {
      name: 'client_sentence_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['client_id', 'original_sentence_id'],
    },
    {
      name: 'path_index',
      type: IndexTypeValues.UNIQUE,
      columns: ['path'],
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

export type DBClip = {
  id: number;
  client_id: string;
  path: string;
  sentence: string;
  original_sentence_id: string;
}

export interface DBClipWithVoters extends DBClip {
  voters: string[];
}

const VERSIONS: SchemaVersions = {
  5: ClipSchema,
};

export default class ClipsTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
