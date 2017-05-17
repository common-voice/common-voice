import promisify from '../../promisify';
import Connection from './connection';

/**
 * Base object for dealing with data in a mongo collection (ie. table).
 */
export default class BaseDB {

  conn: Connection;
  collection: any;
  name: string;

  constructor(conn: Connection, name: string) {
    this.conn = conn;
    this.name = name;
    this.collection = this.conn.getCollection(this.name);
  }

  private makePromise(method: Function, args?: any[]) {
    return promisify(this.conn, method, args);
  }

  count() {
    return this.makePromise(this.collection.count);
  }

  clear() {
    return this.makePromise(this.collection.remove);
  }

  drop() {
    return this.makePromise(this.collection.drop);
  }
}
