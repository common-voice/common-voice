import Mysql from './db/mysql';
import UserDB from './db/user-db';
import BadgesDB from './db/badges-db';
import ProgressDB from './db/progress-db';

export default class DB {
  mysql: Mysql;
  user: UserDB;
  badges: BadgesDB;
  progress: ProgressDB;

  constructor() {
    this.mysql = new Mysql();
    this.user = new UserDB(this.mysql);
    this.progress = new ProgressDB(this.mysql);
    this.badges = new BadgesDB(this.mysql);
  }

  createAll() {
    return this.user
      .create()
      .then(() => {
        return this.badges.create();
      })
      .then(() => {
        return this.progress.create();
      });
  }

  end() {
    this.mysql.end();
  }
}
