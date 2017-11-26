import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const SentencesSchema: TableSchema = {
  name: 'sentences',
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    text: 'varchar(255) NOT NULL',
  },
};

const VERSIONS: SchemaVersions = {
  4: SentencesSchema,
};

export default class SentencesTable extends Table {
  constructor(mysql: Mysql) {
    super(mysql, VERSIONS);
  }
}
