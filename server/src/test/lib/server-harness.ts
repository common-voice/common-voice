import RealServer from '../../server';

/**
 * Server testing harness.
 */
export default class Server {
  server: RealServer;

  constructor() {
    this.server = new RealServer();
  }

  /**
   * We are finished with this harness, clean it up.
   */
  done() {
    this.server.kill();
  }

  /**
   * Make sure we are able to connect to the database.
   */
  async connectToDatabase(): Promise<void> {
    return this.server.ensureDatabaseConnection();
  }

  /**
   * Make sure we can create the basic db setup, like users.
   */
  async createDatabaseUser(): Promise<void> {
    return this.server.ensureDatabaseSetup();
  }

  /**
   * Get the database version from the server.
   */
  async getDatabaseVersion(): Promise<number> {
    return this.server.getDatabaseVersion();
  }
}
