const mysql = require('mysql');
const config = require('../../../../config.json');

type MysqlOptions = {
  user: string;
  database: string;
  password: string;
  host: string;
  port: number;
  max: number;
  idleTimeoutMillis: number;
};

// Default configuration values, notice we dont have password.
const DEFAULTS = {
  user: 'voiceweb',
  database: 'voiceweb',
  password: '',
  host: 'localhost',
  port: 3306,
  max: 10,
  idleTimeoutMillis: 30000
};

export default class Mysql {
  pool: any;

  constructor(options?: MysqlOptions) {
    options = options || Object.create(null);
    // For configuring, use the following order of priority:
    //   1. passed in options
    //   2. options in config.json
    //   3. hard coded DEFAULTS
    var myConfig = {
        user: options.user || config.MSQLUSER || DEFAULTS.user,
        database: options.database || config.MYSQLDB || DEFAULTS.database,
        password: options.password || config.MSQLPASS || DEFAULTS.password,
        host: options.host || config.MSQLHOST || DEFAULTS.host,
        port: options.port || config.MYSQLPORT || DEFAULTS.port,
        max: options.max || DEFAULTS.max,
        idleTimeoutMillis: options.idleTimeoutMillis ||
            DEFAULTS.idleTimeoutMillis,
    };

    this.pool  = mysql.createPool({
        connectionLimit : 20,
        host            : myConfig.host,
        user            : myConfig.user,
        password        : myConfig.password,
        database        : myConfig.database
    });

    this.pool.on('error', this.handleIdleError.bind(this));
  }

  private handleIdleError(err: any) {
    console.error('idle client error', err.message);
  }

  query(text: string, values: any[], callback: Function) {
    this.pool.query(text, function (error, results, fields) {
        error ? callback(error.message, null) : callback(null, results);
    });
  }

  connect(callback: Function) {
    return this.pool.connect(callback);
  }

  end() {
    this.pool.end();
  }
}
