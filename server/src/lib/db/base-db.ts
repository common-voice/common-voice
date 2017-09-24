import Mysql from './mysql';
const Promise = require('bluebird');

/**
 * Base object for dealing with data in Postgres table
 */
export default class BaseDB {
  constructor(
    public mysql: Mysql,
    public name: string,
    public columns: any,
    public index: string
  ) {}

  /**
   * Query database, but using promises.
   */
  q(text: string, values?: any[]) {
    return new Promise(
      (resolve: (rows: any[]) => void, reject: (error: any) => void) => {
        this.mysql.query(text, null, (error: any, results: any) => {
          error ? reject(error) : resolve(results);
        });
      }
    );
  }

  /**
   * Create the postgres table this object represents.
   */
  create(): Promise<any> {
    // Generate our columns section for create query.
    let columns = Object.keys(this.columns).reduce((acc, id) => {
      if (acc.length > 0) {
        // Append comma and newline between columns.
        acc += ',\n';
      }
      return `${acc}${id} ${this.columns[id]}`;
    }, '');

    return this.q(
      `CREATE TABLE IF NOT EXISTS ${this.name} (${columns} ${this.index})`
    );
  }
}
