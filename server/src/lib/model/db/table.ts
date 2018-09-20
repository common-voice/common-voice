import Mysql from './mysql';

/**
 * Base object for dealing with data in MySQL table.
 */
export default class Table {
  private name: string;
  mysql: Mysql;

  constructor(name: string, mysql: Mysql) {
    this.name = name;
    this.mysql = mysql;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Get the count of rows currently in this table.
   */
  async getCount(): Promise<number> {
    const [rows, fields] = await this.mysql.query(
      `SELECT COUNT(*) AS count FROM ${this.getName()}`
    );
    return rows ? rows[0].count : 0;
  }

  async update(fields: any): Promise<void> {
    const [columns, values] = Object.entries(fields).reduce(
      ([columns, values], [column, value]) => [
        columns.concat(column),
        values.concat(typeof value == 'boolean' ? Number(value) : value),
      ],
      [[], []]
    );
    await this.mysql.upsert(this.getName(), columns, values);
  }
}
