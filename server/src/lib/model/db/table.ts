import Mysql from './mysql';

export type TableSchema = {
  name: string;
  columns: any;
  indexes: any;
};

export type SchemaVersions = {
  [key: number]: TableSchema;
};

/**
 * Base object for dealing with data in MySQL table.
 */
export default class Table {
  static PRIMARY_KEY_TYPE = 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT primary key';
  static TIMESTAMP_TYPE = 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP';

  mysql: Mysql;
  schemaVersions: SchemaVersions;

  constructor(mysql: Mysql, schemaVersions: SchemaVersions) {
    this.mysql = mysql;
    this.schemaVersions = schemaVersions;
  }

  /**
   * Upgrade table schema to current one, if exists.
   */
  getUpgradeSql(version: number): string {
    const schema = this.schemaVersions[version];
    if (!schema) {
      // No upgrade for the table at this time.
      return '';
    }

    // TODO: turn this into ALTER TABLE query when needed.
    return this.getCreateSql(version);
  }

  /**
   * Generate our columns section for create query.
   */
  private getColumnsSql(version: number): string {
    const columns = this.schemaVersions[version].columns;
    if (!columns) {
      return;
    }

    return Object.keys(columns).reduce((acc, id) => {
      if (acc.length > 0) {
        acc += ',\n';
      }
      return `${acc}${id} ${columns[id]}`;
    }, '');
  }

  /**
   * Generate our create sql string.
   */
  getCreateSql(version: number): string {
    const schema = this.schemaVersions[version];
    const name = schema.name;
    const indexes = schema.indexes;
    const columns = this.getColumnsSql(version);
    return `CREATE TABLE ${name} (${columns} ${indexes});`;
  }

  /**
   * Create the table using the root connection.
   */
  async create(version: number): Promise<any> {
    const sql = this.getCreateSql(version);
    return this.mysql.rootQuery(sql);
  }
}
