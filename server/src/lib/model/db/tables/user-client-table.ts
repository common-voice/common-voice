import Mysql from '../mysql';
import { default as Table } from '../table';

/**
 * Trackers email to clientid associations.
 */
export default class UserClientTable extends Table {
  constructor(mysql: Mysql) {
    super('user_clients', mysql);
  }
}
