import Mysql from './mysql';
import Table from './table';
import VersionTable from './tables/version-table';
import { Tables } from '../db';

/**
 * Handles Overall DB Schema and Migrations, usually using root connection.
 * We try to run each upgrade through a transaction in a stored procedure.
 */
export default class Schema {
  mysql: Mysql;
  name: string;
  tables: Tables;
  version: VersionTable;
  currentVersion: number;

  constructor(mysql: Mysql, tables: Tables, versionTable: VersionTable) {
    this.mysql = mysql;
    this.name = mysql.options.database;
    this.tables = tables;
    this.version = versionTable;
    this.currentVersion = this.version.getCodeVersion();
  }

  /**
   * Log corpus level messages in a common format.
   */
  private print(...args: any[]) {
    args.unshift('SCHEMA --');
    console.log.apply(console, args);
  }

  /**
   * Make sure we have created the database, and are using it.
   */
  private async ensureDatabase(): Promise<void> {
    await this.mysql.rootQuery(
      `CREATE DATABASE IF NOT EXISTS ${this.name};
       USE ${this.name};`
    );
  }

  /**
   * Drop the current database.
   */
  async dropDatabase(): Promise<void> {
    await this.mysql.rootQuery(`DROP DATABASE IF EXISTS ${this.name}`);
  }

  /**
   * Make sure we have the user privs set up.
   */
  private async ensureDatabaseUser() {
    // Fetch the default username and password.
    const opts = this.mysql.options;
    const username = opts.user;
    const password = opts.password;
    const host = opts.host;
    const database = opts.database;
    await this.mysql.rootTransaction(
      `GRANT SELECT, INSERT, UPDATE, DELETE
       ON ${database}.* TO '${username}'@'${host}'
       IDENTIFIED BY '${password}'; FLUSH PRIVILEGES;`
    );

    // Have the new user use the database.
    await this.mysql.query(`USE ${this.name};`);
  }

  /**
   * Make sure the database structure (DB, DB USER, TABLES) is configured.
   */
  async ensure(): Promise<void> {
    await this.ensureDatabase();
    await this.ensureDatabaseUser();
  }

  /**
   * Upgrades all tables to current version.
   */
  async upgradeToVersion(version: number): Promise<void> {
    // Generate all the sql queries for the upgrade.
    let sql = '';
    for (var i = 0; i < this.tables.length; i++) {
      sql += this.tables[i].getUpgradeSql(version) + '\n';
    }

    sql += '\n' + this.version.getInsertUpgradeSql(version);
    await this.mysql.rootTransaction(sql);
  }

  /**
   * Upgrade to current version of database.
   */
  async upgrade(oldVersion: number): Promise<void> {
    if (oldVersion === this.currentVersion) {
      this.print('schema up to date');
      return;
    }

    let checkVersion = oldVersion;

    this.print(`upgrading from ${oldVersion} to ${this.currentVersion}`);
    for (let i = oldVersion; i < this.currentVersion; i++) {
      const upgradeVersion = i + 1;
      await this.upgradeToVersion(upgradeVersion);

      // Validate the upgrade
      checkVersion = await this.version.getCurrentVersion();
      if (checkVersion !== upgradeVersion) {
        throw new Error(
          `error from ${oldVersion} to ${checkVersion}, ${this.currentVersion}}`
        );
      }
    }

    this.print(
      `upgraded from ${oldVersion} to ${checkVersion}, ${this.currentVersion}`
    );
  }

  /**
   * Show all the tables in the current db.
   */
  async listTables(): Promise<string[]> {
    const [rows, fields] = await this.mysql.rootQuery(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = '${this.name}'`
    );

    return rows.map((row: any) => {
      return row.table_name;
    });
  }

  /**
   * Get a list of expected table values for a version.
   */
  getTablesForVersion(version: number): string[] {
    return this.tables
      .map((table: Table<{}>) => {
        const schema = table.getSchemaForVersion(version);
        return schema ? schema.name : null;
      })
      .filter((name?: string) => {
        return !!name;
      });
  }
}
