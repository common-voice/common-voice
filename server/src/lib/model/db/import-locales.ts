const locales = require('locales/all.json') as string[];
import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function importLocales() {
  await db.query('INSERT IGNORE INTO locales (name) VALUES ?', [
    locales.map(l => [l]),
  ]);

  // Make sure each language has at minimum an "unspecified" accent
  await db.query(`
    INSERT IGNORE INTO accents (locale_id, accent_name, accent_token, user_submitted)
    SELECT id, "", "unspecified", 0 from locales`);
}
