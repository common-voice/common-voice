import Mysql from '../mysql';
import { TableSchema, SchemaVersions, default as Table } from '../table';

const NAME = 'version';

const VersionSchema: TableSchema = {
  name: NAME,
  columns: {
    id: Table.PRIMARY_KEY_TYPE,
    number: 'INT UNSIGNED',
    timestamp: Table.TIMESTAMP_TYPE,
  },
  indexes: null,
};

const VERSIONS: SchemaVersions = {
  1: VersionSchema,
};

/**
 * The version table helps us track schema migrations.
 *   We insert a row for every version number we have
 *   upgraded to.
 */
export default class VersionTable extends Table {
  // Contains the version number stored in code config, not necessarily in db.
  codeVersion: number;

  constructor(mysql: Mysql, version: number) {
    super(mysql, VERSIONS);
    this.codeVersion = version || 0;
  }

  /**
   * Return the version stored in code, no necessarily in the db.
   */
  getCodeVersion(): number {
    return this.codeVersion;
  }

  /**
   * Fetch latest version number of the DATABASE.
   */
  async getCurrentVersion(): Promise<number> {
    let version = -1;

    // Grab the version number of the most recent version table entry.
    try {
      let results, fields;
      [results, fields] = await this.mysql.exec(
        `SELECT number FROM ${NAME} ORDER BY number DESC`
      );

      // If there is nothing in the table, default to version 0.
      if (results.length < 1) {
        version = 0;
      } else {
        // Use the first row, since we sort by most recent.
        version = results[0].number;
      }
    } catch (err) {
      // If table doesn't exist, database is version 0.
      if (err.code === 'ER_NO_SUCH_TABLE') {
        version = 0;
      } else {
        // Don't handle any other errors here.
        throw err;
      }
    }

    return version;
  }

  /**
   * Returns sql string to upgrade DB to version.
   */
  getInsertUpgradeSql(version: number): string {
    return `INSERT INTO ${NAME} (number) VALUES (${version});`;
  }
}
