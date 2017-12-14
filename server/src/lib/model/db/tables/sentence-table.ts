import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const SentencesSchemaV4: TableSchema = {
  name: 'sentences',
  columns: {
    id: 'varchar(255) PRIMARY KEY',
    text: 'TEXT CHARACTER SET utf8 NOT NULL',
  },
};

const SentencesSchemaV7: TableSchema = {
  name: 'sentences',
  columns: {
    id: 'varchar(255) PRIMARY KEY',
    text: 'TEXT CHARACTER SET utf8 NOT NULL',
    is_used: Table.FLAG_TYPE,
  },
};

const VERSIONS: SchemaVersions = {
  4: SentencesSchemaV4,
  8: SentencesSchemaV7,
};

export default class SentencesTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
