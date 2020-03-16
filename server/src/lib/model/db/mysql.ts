import { IConnection } from 'mysql2Types';
import { getConfig } from '../../../config-helper';
import { hash, getFirstDefined } from '../../utility';

const SALT = 'hoads8fh49hgfls';

// Mysql2 has more or less the same interface as @types/mysql,
// so we will use mysql types here where we can.
const mysql2 = require('mysql2/promise');

// Rules for read/write isolation
let QUERY_RULES = {
  selectRead: /\s*SELECT/i,
  selectWrite: /\s*SELECT.*FOR UPDATE/i,
};

export type MysqlOptions = {
  user: string;
  database: string;
  password: string;
  host: string;
  port: number;
  connectTimeout: number;
  multipleStatements: boolean;
  namedPlaceholders: boolean;
};

// Default configuration values, notice we dont have password.
const DEFAULTS: MysqlOptions = {
  user: 'voiceweb',
  database: 'voiceweb',
  password: '',
  host: 'localhost',
  port: 3306,
  connectTimeout: 30000,
  multipleStatements: false,
  namedPlaceholders: true,
};

export default class Mysql {
  rootConn: IConnection;
  pool: any;
  readPool: any;

  constructor() {
    this.rootConn = null;
  }

  /**
   * Get options from params first, then config, and falling back to defaults.
   *   For configuring, use the following order of priority:
   *     1. options in config.json
   *     2. hard coded DEFAULTS
   */
  getMysqlOptions(): MysqlOptions {
    const config = getConfig();
    return {
      user: getFirstDefined(config.MYSQLUSER, DEFAULTS.user),
      database: getFirstDefined(config.MYSQLDBNAME, DEFAULTS.database),
      password: getFirstDefined(config.MYSQLPASS, DEFAULTS.password),
      host: getFirstDefined(config.MYSQLHOST, DEFAULTS.host),
      port: getFirstDefined(config.MYSQLPORT, DEFAULTS.port),
      connectTimeout: DEFAULTS.connectTimeout,
      multipleStatements: false,
      namedPlaceholders: true,
    };
  }

  getMysqlReplicaOptions(): MysqlOptions {
    const config = getConfig();
    let options = this.getMysqlOptions();

    if (config.MYSQLREPLICAHOST) {
      options.host = config.MYSQLREPLICAHOST;
      options.port = config.MYSQLREPLICAPORT;
    }
    return options;
  }

  async getConnection(options: MysqlOptions): Promise<IConnection> {
    return mysql2.createConnection(options);
  }

  async createPool(): Promise<any> {
    return mysql2.createPool(this.getMysqlOptions());
  }

  async createReadPool(): Promise<any> {
    return mysql2.createPool(this.getMysqlReplicaOptions());
  }

  poolPromise: Promise<any>;
  async getPool(): Promise<any> {
    if (this.pool) return this.pool;
    return (
      this.poolPromise ||
      (this.poolPromise = new Promise(async resolve => {
        this.pool = await this.createPool();
        resolve(this.pool);
      }))
    );
  }

  async getReadPool(): Promise<any> {
    if (this.readPool) return this.readPool;
    return (
      this.poolPromise ||
      (this.poolPromise = new Promise(async resolve => {
        this.readPool = await this.createReadPool();
        resolve(this.readPool);
      }))
    );
  }

  async query(...args: any[]) {
    let sqlQuery = args[0];

    if (
      QUERY_RULES.selectRead.test(sqlQuery) &&
      !QUERY_RULES.selectWrite.test(sqlQuery)
    ) {
      return (await this.getReadPool()).query(...args);
    }
    return (await this.getPool()).query(...args);
  }

  async escape(...args: any[]) {
    return (await this.getPool()).escape(...args);
  }

  async ensureRootConnection(): Promise<void> {
    // Check if we already have the connection we want.
    if (this.rootConn) {
      return;
    }

    // Copy our pre-installed configuration.
    const opts: MysqlOptions = Object.assign({}, this.getMysqlOptions());

    // Do not specify the database name when connecting.
    delete opts.database;

    // Root gets an upgraded connection optimized for schema migration.
    const config = getConfig();
    opts.user = config.DB_ROOT_USER;
    opts.password = config.DB_ROOT_PASS;
    opts.multipleStatements = true;

    const conn = await this.getConnection(opts);
    conn.on('error', this.handleError.bind(this));

    this.rootConn = conn;
  }

  private handleError(err: any) {
    console.error('unhandled mysql error', err.message);
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

    await this.query(
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
    if (this.pool) {
      this.pool.end().catch((e: any) => console.error(e));
      this.pool = null;
    }
    if (this.rootConn) {
      this.rootConn.destroy();
      this.rootConn = null;
    }
  }
}

let instance: Mysql;

export function getMySQLInstance() {
  return instance || (instance = new Mysql());
}
