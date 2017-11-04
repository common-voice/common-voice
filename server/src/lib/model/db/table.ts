import Mysql from './mysql';

export type ColumnType = {
  [key: string]: string;
};

export type IndexType = {
  name: string;
  type: string; // UNIQUE|INDEX
  columns: string[];
};

export type TableSchema = {
  name: string;
  columns: ColumnType;
  indexes: IndexType[];
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
  static EMAIL_TYPE = 'varchar(255)';
  static CLIENTID_TYPE = 'char(36)';

  mysql: Mysql;
  schemaVersions: SchemaVersions;

  constructor(mysql: Mysql, schemaVersions: SchemaVersions) {
    this.mysql = mysql;
    this.schemaVersions = schemaVersions;
  }

  /**
   * Get the latest name of the table from schema version history.
   */
  getName(): string {
    // It's a hack to grab current version from myself config cache.
    const schema = this.getSchemaForVersion(this.mysql.config.VERSION);
    return schema ? schema.name : '';
  }

  /**
   * Get the count of rows currently in this table.
   */
  async getCount(): Promise<number> {
    const [rows, fields] = await this.mysql.query(
      `SELECT COUNT(*) AS count FROM ${this.getName()}`
    );
    return rows ? rows[0].count : 0;
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
  private getColumnsSql(columns: ColumnType): string {
    if (!columns) {
      return '';
    }

    return Object.keys(columns).reduce((acc, id) => {
      if (acc.length > 0) {
        acc += ',\n';
      }
      return `${acc}${id} ${columns[id]}`;
    }, '');
  }

  /**
   * Genereate sql syntax for indexes.
   */
  private getIndexSql(indexes: IndexType[]): string {
    if (!indexes || indexes.length < 1) {
      return '';
    }

    return indexes
      .map((index: IndexType) => {
        return `${index.type} ${index.name} (${index.columns.join(', ')})`;
      })
      .join(', ');
  }

  /**
   * Generate the table content (columns and indexes) part of the query.
   */
  private getContentSql(schema: TableSchema): string {
    const columns = this.getColumnsSql(schema.columns);
    const indexes = this.getIndexSql(schema.indexes);
    // Make sure we have a separator if indexes are present.
    return columns + (indexes ? ', ' + indexes : '');
  }

  /**
   * Return the table schema at specified version.
   */
  getSchemaForVersion(version: number): TableSchema {
    if (!version) {
      return null;
    }

    // Check each version going back to zero until we find one.
    let schema: TableSchema;
    do {
      schema = this.schemaVersions[version];
    } while (!schema && --version > 0);

    return schema;
  }

  /**
   * Generate our create sql string.
   */
  getCreateSql(version: number): string {
    const schema = this.schemaVersions[version];
    const name = schema.name;
    const content = this.getContentSql(schema);
    return `CREATE TABLE ${name} (${content});`;
  }

  /**
   * Create the table using the root connection.
   */
  async create(version: number): Promise<any> {
    const sql = this.getCreateSql(version);
    return this.mysql.rootQuery(sql);
  }
}
