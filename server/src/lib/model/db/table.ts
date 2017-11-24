import Mysql from './mysql';

export enum IndexTypeValues {
  UNIQUE = 'UNIQUE',
  INDEX = 'INDEX',
}

export type ColumnType = {
  [key: string]: string;
};

export type IndexType = {
  name: string;
  type: IndexTypeValues;
  columns: string[];
};

export type ForeignKeyType = {
  targetTable: string;
  columns: {
    [ownColumn: string]: string;
  };
};

export type TableSchema = {
  name: string;
  columns: ColumnType;
  indexes?: IndexType[];
  foreignKeys?: ForeignKeyType[];
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
  static FLAG_TYPE = 'BOOLEAN NOT NULL DEFAULT false';
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
   * Return the schema previous to the passed in, or current version.
   */
  getPreviousSchema(version?: number): TableSchema {
    let schema = null;
    for (let i = version - 1; i >= 0; i--) {
      if (this.schemaVersions[i]) {
        schema = this.schemaVersions[i];
        break;
      }
    }
    return schema;
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

    return this.getAlterOrCreateSql(version);
  }

  /**
   * Generate our columns section for create query.
   */
  private getColumnsSql(columns: ColumnType, alter?: boolean): string {
    if (!columns) {
      return '';
    }

    let alterSql = alter ? 'ADD COLUMN ' : '';

    return Object.keys(columns).reduce((acc, id) => {
      if (acc.length > 0) {
        acc += ',\n';
      }
      return `${acc}${alterSql}${id} ${columns[id]}`;
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

  private getForeignKeySql(foreignKeys: ForeignKeyType[]): string {
    if (!foreignKeys || foreignKeys.length < 1) {
      return '';
    }

    return foreignKeys
      .map(({ columns, targetTable }: ForeignKeyType) => {
        const ownColumns = Object.keys(columns).join(', ');
        const foreignColumns = Object.keys(columns)
          .map(k => columns[k])
          .join(', ');
        return `FOREIGN KEY (${ownColumns}) REFERENCES ${targetTable}(${foreignColumns})`;
      })
      .join(', ');
  }

  /**
   * Generate the table content (columns and indexes) part of the query.
   */
  private getContentSql(schema: TableSchema): string {
    const columns = this.getColumnsSql(schema.columns);
    const indexes = this.getIndexSql(schema.indexes);
    const foreignKeys = this.getForeignKeySql(schema.foreignKeys);
    // Make sure we have a separator if indexes are present.
    return (
      columns +
      (indexes ? ', ' + indexes : '') +
      (foreignKeys ? ', ' + foreignKeys : '')
    );
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
   * Return query for table, assuming version exists.
   */
  getAlterOrCreateSql(version: number): string {
    // If it's brand new, use the create sql.
    // Otherwise, we alter the table.
    if (!this.getPreviousSchema(version)) {
      return this.getCreateSql(version);
    } else {
      return this.getAlterSql(version);
    }
  }

  /**
   * Generate an alter sql string.
   */
  getAlterSql(version: number): string {
    const schema = this.schemaVersions[version];
    const prev = this.getPreviousSchema(version);

    // Were there any columns added?
    const newColumns = Object.keys(
      schema.columns
    ).reduce((acc: ColumnType, column: string): ColumnType => {
      if (!prev.columns[column]) {
        acc[column] = schema.columns[column];
      }
      return acc;
    }, {});

    // If there are no new columns, nothing to do here.
    if (Object.keys(newColumns).length === 0) {
      return '';
    }

    const columnSql = this.getColumnsSql(newColumns, true);
    return `ALTER TABLE ${schema.name} ${columnSql};`;
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
