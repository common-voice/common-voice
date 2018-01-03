import * as path from 'path';
const DBMigrate = require('db-migrate');
import { CommonVoiceConfig } from '../../../config-helper';
import Mysql from './mysql';

export default class Schema {
  private mysql: Mysql;
  private name: string;
  private config: CommonVoiceConfig;

  constructor(mysql: Mysql, config: CommonVoiceConfig) {
    this.mysql = mysql;
    this.config = config;
    this.name = mysql.options.database;
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

  async upgrade() {
    const {
      MYSQLDBNAME,
      MYSQLHOST,
      DB_ROOT_PASS,
      DB_ROOT_USER,
      VERSION,
    } = this.config;
    const dbMigrate = DBMigrate.getInstance(true, {
      config: {
        dev: {
          driver: 'mysql',
          database: MYSQLDBNAME,
          host: MYSQLHOST,
          password: DB_ROOT_PASS,
          user: DB_ROOT_USER,
          multipleStatements: true,
        },
      },
      cwd: path.isAbsolute(__dirname)
        ? __dirname
        : path.resolve(path.join('server', __dirname)),
    });
    await (VERSION ? dbMigrate.sync(VERSION) : dbMigrate.up());
  }
}
