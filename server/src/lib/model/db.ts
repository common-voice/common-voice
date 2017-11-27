import { pick } from 'lodash';
import Mysql from './db/mysql';
import Schema from './db/schema';
import Table from './db/table';
import { UpdatableUserFields, UserTable } from './db/tables/user-table';
import UserClientTable from './db/tables/user-client-table';
import VersionTable from './db/tables/version-table';
import { CommonVoiceConfig } from '../../config-helper';

export type Tables = Table[];

export default class DB {
  config: CommonVoiceConfig;
  currentVersion: number;
  mysql: Mysql;
  schema: Schema;
  tables: Tables;
  user: UserTable;
  userClient: UserClientTable;
  version: VersionTable;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.currentVersion = config.VERSION;
    this.mysql = new Mysql(this.config);
    this.user = new UserTable(this.mysql);
    this.userClient = new UserClientTable(this.mysql);
    this.version = new VersionTable(this.mysql, this.currentVersion);

    this.tables = [];
    this.tables.push(this.user as Table);
    this.tables.push(this.userClient as Table);
    this.tables.push(this.version as Table);

    this.schema = new Schema(this.mysql, this.tables, this.version);
  }

  /**
   * Normalize email address as input.
   * TODO: add validation here.
   */
  private formatEmail(email?: string): string {
    if (!email) {
      return '';
    }

    return email.toLowerCase();
  }

  /**
   * Insert or update user client row.
   */
  async updateUser(
    clientId: string,
    fields: UpdatableUserFields
  ): Promise<void> {
    let { email } = fields;
    if (email) email = this.formatEmail(email);
    await Promise.all([
      this.user.update({
        email,
        ...pick(fields, 'send_emails', 'has_downloaded'),
      }),
      this.userClient.update(clientId, email),
    ]);
  }

  /**
   * Ensure the database is setup.
   */
  async ensureSetup(): Promise<void> {
    return this.schema.ensure();
  }

  /**
   * I hope you know what you're doing.
   */
  async drop(): Promise<void> {
    return this.schema.dropDatabase();
  }

  /**
   * Print the current count of users in db.
   */
  async getUserCount(): Promise<number> {
    return this.user.getCount();
  }

  /**
   * Print the current count of clients in db.
   */
  async getClientCount(): Promise<number> {
    return this.userClient.getCount();
  }

  /**
   * Make sure we have a fully updated schema.
   */
  async ensureLatest(): Promise<void> {
    await this.ensureSetup();
    let version;

    try {
      version = await this.version.getCurrentVersion();
    } catch (err) {
      console.error('error fetching version', err);
      version = 0;
    }

    await this.schema.upgrade(version);
  }

  /**
   * End connection to the database.
   */
  endConnection(): void {
    this.mysql.endConnection();
  }
}
