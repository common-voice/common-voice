import { CommonVoiceConfig, getConfig } from '../../config-helper';
import RealServer from '../../server';

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
   * Get the version of the code.
   */
  getCodeVersion() {
    return this.config.VERSION;
  }

  /**
   * Make sure we are able to connect to the database.
   */
  async connectToDatabase(): Promise<void> {
    return this.server.model.db.mysql.ensureRootConnection();
  }

  /**
   * Reset the database to initial factory settings.
   */
  async resetDatabase(): Promise<void> {
    return this.server.resetDatabase();
  }

  /**
   * Get the database version from the server.
   */
  async getDatabaseVersion(): Promise<number> {
    return this.server.getDatabaseVersion();
  }

  /**
   * Upgrade to the current DB by performing normal maintenance.
   */
  async performMaintenance(): Promise<void> {
    return this.server.performMaintenance();
  }

  /**
   * Upgrade to a certain version of the DB.
   */
  async upgradeToVersion(version: number) {
    return this.server.model.db.schema.upgradeToVersion(version);
  }

  /**
   * Get a list of tables in the current DB.
   */
  async getTableList(): Promise<string[]> {
    return this.server.model.db.schema.listTables();
  }

  /**
   * Get a list of expected table values for a version.
   */
  getTablesForVersion(version: number): string[] {
    return this.server.model.db.schema.getTablesForVersion(version);
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
