import Mysql from './mysql';
import BaseDB from './base-db';

const NAME = 'badges';

const COLUMNS = {
  id: 'INT NOT NULL AUTO_INCREMENT primary key',
  name: 'varchar(100)',
  imageurl: 'text',
};

const INDEX = '';

export default class BadgesDB extends BaseDB {
  constructor(pg: Mysql) {
    super(pg, NAME, COLUMNS, INDEX);
  }
}
