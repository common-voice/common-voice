import Mysql from './db/mysql';
import Schema from './db/schema';
import Table from './db/table';
import UserTable from './db/user-table';
import VersionTable from './db/version-table';

export type Tables = Table[];

export default class DB {
  mysql: Mysql;
  schema: Schema;
  tables: Tables;
  user: UserTable;
  version: VersionTable;

  constructor() {
    this.mysql = new Mysql();
    this.user = new UserTable(this.mysql);
    this.version = new VersionTable(this.mysql);

    this.tables = [];
    this.tables.push(this.user as Table);
    this.tables.push(this.version as Table);

    this.schema = new Schema(this.mysql, this.tables, this.version);
  }

  /**
   * Make sure we have a fully updated schema.
   */
  async ensureLatest() {
    await this.schema.ensure();
    let version;

    try {
      version = await this.version.getCurrentVersion();
    } catch (err) {
      console.error('error fetching version', err);
      version = 0;
    }

    return this.schema.upgrade(version);
  }
}
