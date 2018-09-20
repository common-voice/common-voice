import Mysql from '../mysql';
import { default as Table } from '../table';

export default class VoteTable extends Table {
  constructor(mysql: Mysql) {
    super('votes', mysql);
  }
}
