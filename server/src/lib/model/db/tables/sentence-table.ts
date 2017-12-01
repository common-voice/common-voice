import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const SentencesSchema: TableSchema = {
  name: 'sentences',
  columns: {
    id: 'varchar(255) PRIMARY KEY',
    text: 'TEXT CHARACTER SET utf8 NOT NULL',
  },
};

const VERSIONS: SchemaVersions = {
  4: SentencesSchema,
};

export default class SentencesTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
