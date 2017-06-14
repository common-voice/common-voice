import Mysql from './mysql';
import BaseDB from './base-db';

const NAME = 'progress';

const COLUMNS = {
  'id': 'BIGINT NOT NULL AUTO_INCREMENT primary key',
  'userid': 'bigint',
  'points': 'bigint',
  'badgeid': 'int'
};

const INDEX = ", INDEX user_id_idx(userid), FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE, INDEX badge_id_idx(badgeid), FOREIGN KEY (badgeid) REFERENCES badges(id)";

export default class ProgressDB extends BaseDB {
  constructor(pg: Mysql) {
    super(pg, NAME, COLUMNS, INDEX);
  }
}
