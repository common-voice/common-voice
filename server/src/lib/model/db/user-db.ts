import Mysql from './mysql';
import BaseDB from './base-db';

const NAME = 'users';

const COLUMNS = {
  id: 'BIGINT NOT NULL AUTO_INCREMENT primary key',
  email: 'varchar(200) unique',
  birthyear: 'smallint',
  accent: 'varchar(100)',
  gender: 'varchar(1)',
  name: 'varchar(50)',
  userid: 'bigint',
};

const INDEX = '';

export default class UserDB extends BaseDB {
  constructor(pg: Mysql) {
    super(pg, NAME, COLUMNS, INDEX);
  }
}
