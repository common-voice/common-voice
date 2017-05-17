import Connection from './db/connection';
import User from './db/user';

export default class DB {
  connection: Connection;
  user: User;

  constructor() {
    this.connection = new Connection();
  }

  init() {
    return this.connection.init()
      .then(() => {
        let users = this.connection.getCollection('users');
        this.user = new User(users);
      });
  }
}
