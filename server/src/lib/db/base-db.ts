import Postgres from './postgres';
import promisify from '../../promisify';

const Promise = require('bluebird');

/**
 * Base object for dealing with data in Postgres table
 */
export default class BaseDB {

  constructor(
    public pg: Postgres,
    public name: string,
    public columns: Object
  ) {}

  /**
   * Query database, but using promises.
   */
  q(text: string, values?: any[]) {
    return promisify(this.pg, this.pg.query, [text, values]);
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

    return this.q(`CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`);
  }
}
