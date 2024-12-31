import { getConfig, injectConfig } from '../../config-helper';
import RealServer from '../../server';
import Mysql from '../../lib/model/db/mysql';

const DB_PREFIX = 'test_';

/**
 * Server testing harness.
 */
export default class ServerHarness {
  server: RealServer;

  constructor() {
    const config = getConfig();
    // Use a different database name then default for tests.
    config.MYSQLDBNAME =
      DB_PREFIX +
      config.MYSQLDBNAME +
      '_' +
      Math.random().toString(36).substring(7);
    injectConfig(config);
    this.server = new RealServer({ bundleCrossLocaleMessages: false, setupQueues: false });
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
  run(): Promise<void> {
    return this.server.run({ doImport: false });
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

  emptyDatabase() {
    return this.server.emptyDatabase();
  }

  async getClipCount(): Promise<number> {
    return this.server.model.db.getClipCount();
  }
}
