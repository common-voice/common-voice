const locales = require('locales/all.json') as string[];
import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function importLocales() {
  await db.query('INSERT IGNORE INTO locales (name) VALUES ?', [
    locales.map(l => [l]),
  ]);
}
