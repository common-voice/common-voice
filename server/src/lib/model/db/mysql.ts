import { hash, getFirstDefined } from '../../utility';
import { IConnection } from 'mysql2Types';
import promisify from '../../../promisify';
import { CommonVoiceConfig } from '../../../config-helper';

const SALT = 'hoads8fh49hgfls';

// Mysql2 has more or less the same interface as @types/mysql,
// so we will use mysql types here where we can.
const mysql2 = require('mysql2/promise');

export type MysqlOptions = {
  user: string;
  database: string;
  password: string;
  host: string;
  port: number;
  max: number;
  idleTimeoutMillis: number;
  multipleStatements: boolean;
};

// Default configuration values, notice we dont have password.
const DEFAULTS: MysqlOptions = {
  user: 'voiceweb',
  database: 'voiceweb',
  password: '',
  host: 'localhost',
  port: 3306,
  max: 10,
  idleTimeoutMillis: 30000,
  multipleStatements: false,
};

export default class Mysql {
  config: CommonVoiceConfig;
  options: MysqlOptions;
  conn: IConnection;
  rootConn: IConnection;

  /**
   * Get options from params first, then config, and falling back to defaults.
   *   For configuring, use the following order of priority:
   *     1. options in config.json
   *     2. hard coded DEFAULTS
   */
  private getMysqlOptions(config: CommonVoiceConfig): MysqlOptions {
    return {
      user: getFirstDefined(config.MYSQLUSER, DEFAULTS.user),
      database: getFirstDefined(config.MYSQLDBNAME, DEFAULTS.database),
      password: getFirstDefined(config.MYSQLPASS, DEFAULTS.password),
      host: getFirstDefined(config.MYSQLHOST, DEFAULTS.host),
      port: getFirstDefined(config.MYSQLPORT, DEFAULTS.port),
      max: DEFAULTS.max,
      idleTimeoutMillis: DEFAULTS.idleTimeoutMillis,
      multipleStatements: false,
    };
  }

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.options = this.getMysqlOptions(config);
    this.conn = null;
    this.rootConn = null;
  }

  async getConnection(options: MysqlOptions): Promise<IConnection> {
    return mysql2.createConnection(options);
  }

  async ensureConnection(root?: boolean): Promise<void> {
    // Check if we already have the connection we want.
    if ((root && this.rootConn) || (!root && this.conn)) {
      return;
    }

    // Copy our pre-installed configuration.
    const opts: MysqlOptions = Object.assign({}, this.options);

    // Do not specify the database name when connecting.
    delete opts.database;

    // Root gets an upgraded connection optimized for schema migration.
    if (root) {
      opts.user = this.config.DB_ROOT_USER;
      opts.password = this.config.DB_ROOT_PASS;
      opts.multipleStatements = true;
    }

    const conn = await this.getConnection(opts);
    conn.on('error', this.handleError.bind(this));

    if (root) {
      this.rootConn = conn;
    } else {
      this.conn = conn;
    }
  }

  async ensureRootConnection(): Promise<void> {
    return this.ensureConnection(true);
  }

  private handleError(err: any) {
    console.error('unhandled mysql error', err.message);
    // Kill current connection so that we re-init on next query.
    this.endConnection();
  }

  async exec(sql: string, values?: any[]): Promise<any[]> {
    values = values || [];
    await this.ensureConnection();
    return this.conn.execute(sql, values);
  }

  async query(sql: string): Promise<any> {
    await this.ensureConnection();
    return this.conn.query(sql);
  }

  /**
   * Insert or update query generator.
   */
  async upsert(
    tableName: string,
    columns: string[],
    values: any[]
  ): Promise<void> {
    // Generate our bounded parameters.
    const params = values.map((val: any) => {
      return '?';
    });
    const dupeSql = columns.map((column: string) => {
      return `${column} = ?`;
    });

    // We are using the same values twice in the query.
    const allValues = values.concat(values);

    const results = await this.exec(
      `INSERT INTO ${tableName} (${columns.join(',')})
       VALUES (${params.join(',')})
       ON DUPLICATE KEY UPDATE ${dupeSql.join(',')};`,
      allValues
    );
  }

  private getProcedureName(body: string): string {
    return 'F_' + hash(body, SALT);
  }

  /**
   * Call a stored procedure by procedure name generated in getProcedureName.
   */
  async callProc(name: string): Promise<any> {
    return this.rootConn.query(`CALL \`${name}\``);
  }

  /**
   * Create and execute a stored procedure as root.
   */
  async rootTransaction(body: string): Promise<void> {
    // Hash proc body to get a unique proc name.
    // This makes sure we have a unique name for each proc operation.
    const name = this.getProcedureName(body);
    const transactionQuery = `
      CREATE PROCEDURE \`${name}\`()
      BEGIN
          DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
          BEGIN
            ROLLBACK;
            RESIGNAL;
          END;
          START TRANSACTION;
          ${body}
          COMMIT;
      END;`;

    // Ensure root.
    await this.ensureRootConnection();

    // Here we'll try to create the proc, but if the proc name
    // already exists we can be sure it's the same operation
    // so we will trap the error and call the pre-defined proc.
    try {
      await this.rootConn.query(transactionQuery);
    } catch (err) {
      // If proc already exists, we are good to go.
      if (err.code !== 'ER_SP_ALREADY_EXISTS') {
        throw err;
      }
    }

    // Attempting to call proc.
    await this.callProc(name);
  }

  /**
   * Execute a prepared statement on the root connection.
   */
  async rootExec(sql: string, values?: any[]): Promise<any> {
    values = values || [];
    await this.ensureRootConnection();
    return this.rootConn.execute(sql, values);
  }

  /**
   * Execute a regular query on the root connection.
   */
  async rootQuery(sql: string): Promise<any> {
    await this.ensureRootConnection();
    return this.rootConn.query(sql);
  }

  /**
   * Close all connections to the database.
   */
  endConnection(): void {
    if (this.conn) {
      this.conn.destroy();
      this.conn = null;
    }
    if (this.rootConn) {
      this.rootConn.destroy();
      this.rootConn = null;
    }
  }
}
