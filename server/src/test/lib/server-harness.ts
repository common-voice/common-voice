import { CommonVoiceConfig, getConfig } from '../../config-helper';
import RealServer from '../../server';
import Mysql from "../../lib/model/db/mysql";

const DB_PREFIX = 'test_';

/**
 * Server testing harness.
 */
export default class ServerHarness {
  config: CommonVoiceConfig;
  server: RealServer;

  constructor(config?: CommonVoiceConfig) {
    this.config = config ? config : getConfig();
    // Use a different database name then default for tests.
    this.config.MYSQLDBNAME = DB_PREFIX + this.config.MYSQLDBNAME;
    this.config.ENABLE_MIGRATIONS = false;
    this.server = new RealServer(this.config);
  }

  get mysql(): Mysql {
    return this.server.model.db.mysql;
  }

  /**
   * We are finished with this harness, clean it up.
   */
  done() {
    this.server.kill();
  }

  /**
   * Start the web server.
   */
  listen(): void {
    this.server.listen();
  }

  /**
   * Make sure we are able to connect to the database.
   */
  async connectToDatabase(): Promise<void> {
    return this.mysql.ensureRootConnection();
  }

  /**
   * Reset the database to initial factory settings.
   */
  async resetDatabase(): Promise<void> {
    return this.server.resetDatabase();
  }

  /**
   * Upgrade to the current DB by performing normal maintenance.
   */
  async performMaintenance(): Promise<void> {
    return this.server.performMaintenance();
  }

  /**
   * Get amount of known clients from the DB.
   */
  async getClientCount(): Promise<number> {
    return this.server.model.db.userClient.getCount();
  }

  /**
   * Get amount of known emails from the DB.
   */
  async getEmailCount(): Promise<number> {
    return this.server.model.db.user.getCount();
  }
}
