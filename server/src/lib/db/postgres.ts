const pg = require('pg').native;
const config = require('../../../../config.json');

// Default configuration values, notice we dont have password.
const DEFAULTS = {
  user: 'voiceweb',
  database: 'voiceweb',
  password: '',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

export default class Postgres {
  pool: any;

  constructor(options) {
    options = options || {};

    // For configuring, use the following order of priority:
    //   1. passed in options
    //   2. options in config.json
    //   3. hard coded DEFAULTS
    let pgConfig = {
      user: options.user || config.PGUSER || DEFAULTS.user,
      database: options.database || config.PGNAME || DEFAULTS.database,
      password: options.password || config.PGPASS || DEFAULTS.password,
      host: options.host || config.PGHOST || DEFAULTS.host,
      port: options.port || config.PGPORT || DEFAULTS.port,
      max: options.max || DEFAULTS.max,
      idleTimeoutMillis: options.timeout || DEFAULTS.idleTimeoutMillis,
    };

    this.pool = new pg.Pool(pgConfig);
    this.pool.on('error', this.handleIdleError.bind(this));
  }

  private handleIdleError(err: ErrorEvent) {
    console.error('idle client error', err.message);
  }

  query(text: string, values: any[], callback: Function) {
    return this.pool.query(text, values, callback);
  }

  connect(callback: Function) {
    return this.pool.connect(callback);
  }

  disconnect() {
    this.pool.end();
  }
}
