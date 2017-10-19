import { getFirstDefined } from '../utility';
import { createPool, IPool } from 'mysql';

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
  idleTimeoutMillis: 30000,
};

export default class Mysql {
  pool: IPool;

  constructor(options?: MysqlOptions) {
    options = options || Object.create(null);

    // For configuring, use the following order of priority:
    //   1. passed in options
    //   2. options in config.json
    //   3. hard coded DEFAULTS
    var myConfig = {
      user: getFirstDefined(options.user, config.MYSQLUSER, DEFAULTS.user),
      database: getFirstDefined(
        options.database,
        config.MYSQLDB,
        DEFAULTS.database
      ),
      password: getFirstDefined(
        options.password,
        config.MYSQLPASS,
        DEFAULTS.password
      ),
      host: getFirstDefined(options.host, config.MYSQLHOST, DEFAULTS.host),
      port: getFirstDefined(options.port, config.MYSQLPORT, DEFAULTS.port),
      max: getFirstDefined(options.max, DEFAULTS.max),
      idleTimeoutMillis: getFirstDefined(
        options.idleTimeoutMillis,
        DEFAULTS.idleTimeoutMillis
      ),
    };

    this.pool = createPool({
      connectionLimit: 100,
      host: myConfig.host,
      user: myConfig.user,
      password: myConfig.password,
      database: myConfig.database,
    });

    this.pool.on('error', this.handleIdleError.bind(this));
  }

  private handleIdleError(err: any) {
    console.error('idle client error', err.message);
  }

  query(text: string, values: any[], callback: Function) {
    this.pool.query(text, (error: any, results: any, fields: any) => {
      error ? callback(error.message, null) : callback(null, results);
    });
  }

  end() {
    this.pool.end();
  }
}
