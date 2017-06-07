import Postgres from './db/postgres';
import UserDB from './db/user-db';

const Promise = require('bluebird');

export default class DB {
  pg: Postgres;
  user: UserDB;

  constructor() {
    this.pg = new Postgres();
    this.user = new UserDB(this.pg);
  }

  createAll() {
    return Promise.all([
      this.user.create()
    ]);
  }

  end() {
    this.pg.end();
  }
}
