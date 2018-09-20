import pick = require('lodash.pick');
import { getMySQLInstance } from './db/mysql';

const db = getMySQLInstance();

export default {
  async findAllWithLocales({
    client_id,
    email,
  }: {
    client_id: string;
    email: string;
  }) {
    const [rows] = await db.query(
      `
        SELECT u.*, accents.accent, locales.name AS locale
        FROM user_clients u
        LEFT JOIN user_client_accents accents on u.client_id = accents.client_id
        LEFT JOIN locales on accents.locale_id = locales.id
        WHERE u.client_id = ? OR email = ?
      `,
      [client_id || null, email || null]
    );
    return Object.values(
      rows.reduce((obj: { [client_id: string]: any }, row: any) => {
        const c = obj[row.client_id];
        obj[row.client_id] = {
          ...pick(row, 'client_id', 'accent', 'age', 'gender'),
          locales: (c ? c.locales : []).concat(
            row.accent ? { accent: row.accent, locale: row.locale } : []
          ),
        };
        return obj;
      }, {})
    );
  },
};
