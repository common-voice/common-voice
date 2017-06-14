import Mysql from './db/mysql';
import UserDB from './db/user-db';

const Promise = require('bluebird');

export default class DB {
  mysql: Mysql;
  user: UserDB;

  constructor() {
    this.mysql = new Mysql();
    this.user = new UserDB(this.mysql);
  }

  createAll() {
    return Promise.all([
      this.user.create()
    ]);
  }

  end() {
    this.mysql.end();
  }
}
