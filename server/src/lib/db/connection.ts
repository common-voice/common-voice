import { Db, Collection } from 'mongodb';

const path = require('path');
const Promise = require('bluebird');
const mongo = require('mongodb');
const Client = mongo.MongoClient;

const REPO_PATH = path.resolve(__dirname, '../../../');
const CONFIG_PATH = path.resolve(REPO_PATH, 'config.json');

export default class Connection {
  config: any;
  db: Db;

  constructor() {
    this.config = require(CONFIG_PATH);
    this.db = null;
  }

  private getConnectionString(user: string, pass: string,
                              port: string, name: string) {
    return `mongodb://${user}:${pass}@localhost:${port}/${name}`;
  }

  init(): Promise<void> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      let user = this.config.DB_USER;
      let pass = this.config.DB_PASS;
      let port = this.config.DB_PORT;
      let name = this.config.DB_NAME;
      let url = this.getConnectionString(user, pass, port, name);

      mongo.MongoClient.connect(url, (err: Error, db: Db) => {
        if (err) {
          console.error('could not connect to mongo', err);
          reject(new Event('Connection Error'));
          return;
        }

        this.db = db;
        resolve(null);
      });
    });
  }

  getCollection(name: string): Collection {
    if (!this.db) {
      console.error('cannot get connection, no mongo db created, call init');
      return null;
    }

    return this.db.collection(name);
  }



  disconnect() {
    if (this.db) {
      this.db.close();
    }
  }
}
