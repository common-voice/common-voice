import Postgres from './postgres';
import BaseDB from './base-db';

const NAME = 'users';

const COLUMNS = {
  'id': 'text primary key',
  'email': 'text unique',
  'birthyear': 'smallserial'
};

export default class UserDB extends BaseDB {
  constructor(pg: Postgres) {
    super(pg, NAME, COLUMNS);
  }
}
