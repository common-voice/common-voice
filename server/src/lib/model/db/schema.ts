import * as path from 'path';
const DBMigrate = require('db-migrate');
import { getConfig } from '../../../config-helper';
import Mysql from './mysql';

export default class Schema {
  private mysql: Mysql;
  private name: string;

  constructor(mysql: Mysql) {
    this.mysql = mysql;
    this.name = mysql.getMysqlOptions().database;
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
   *
   * @deprecated This throws an error. The user has to be created beforehand, since we need a user
   * to be able to run the query in the first hand.
   */
  /**
  private async ensureDatabaseUser() {
    // Fetch the default username and password.
    const opts = this.mysql.getMysqlOptions();
    const username = opts.user;
    const password = opts.password;
    const host = opts.host;
    const database = opts.database;
    await this.mysql.rootTransaction(
      `CREATE USER IF NOT EXISTS '${username}' IDENTIFIED BY '${password}';
       GRANT SELECT, INSERT, UPDATE, DELETE
       ON ${database}.* TO '${username}'; FLUSH PRIVILEGES;`
    );

    // Have the new user use the database.
    await this.mysql.query(`USE ${this.name};`);
  }
  */

  /**
   * Make sure the database structure (DB, DB USER, TABLES) is configured.
   */
  async ensure(): Promise<void> {
    await this.ensureDatabase();
    // await this.ensureDatabaseUser();
  }

  async upgrade() {
    const {
      MYSQLDBNAME,
      MYSQLHOST,
      DB_ROOT_PASS,
      DB_ROOT_USER,
      VERSION,
    } = getConfig();
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
    console.log(
      VERSION
        ? 'Running migrations for version ' + VERSION
        : 'Running migrations'
    );
    await (VERSION ? dbMigrate.sync(VERSION) : dbMigrate.up());
  }
}
