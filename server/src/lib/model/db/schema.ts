import Mysql from './mysql';
import Table from './table';
import Version from './version-table';
import { Tables } from '../db';

const CURRENT_VERSION = 1;

const CWD = process.cwd();
const CONFIG_FILE = CWD + '/config.json';
const config = require(CONFIG_FILE);

/**
 * Handles Overall DB Schema and Migrations, usually using root connection.
 * We try to run each upgrade through a transaction in a stored procedure.
 */
export default class Schema {
  mysql: Mysql;
  name: string;
  tables: Tables;
  version: Version;

  constructor(mysql: Mysql, tables: Tables, version: Version) {
    this.mysql = mysql;
    this.name = mysql.options.database;
    this.tables = tables;
    this.version = version;
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
      `CREATE USER IF NOT EXISTS '${username}'@'${host}' IDENTIFIED BY '${password}';
       GRANT SELECT, INSERT ON ${database}.* TO '${username}'@'${host}';
       FLUSH PRIVILEGES;`
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
   * Upgrade to CURRENT_VERSION of database.
   */
  async upgrade(oldVersion: number): Promise<void> {
    if (oldVersion === CURRENT_VERSION) {
      this.print('schema up to date');
      return;
    }

    this.print(`upgrading from ${oldVersion} to ${CURRENT_VERSION}`);
    for (let i = oldVersion; i < CURRENT_VERSION; i++) {
      const upgradeVersion = oldVersion + 1;
      await this.upgradeToVersion(upgradeVersion);
    }

    this.print('updated to version', CURRENT_VERSION);
  }
}
