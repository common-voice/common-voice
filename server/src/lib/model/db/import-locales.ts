import fetch from 'node-fetch';
import { getMySQLInstance } from './mysql';

type Locale = {
  code: string;
};
interface PontoonData {
  locale: Locale;
}

const db = getMySQLInstance();

const fetchPontoonLanguages = async (): Promise<Locale[]> => {
  const url =
    'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}';
  const response = await fetch(url);
  const { data } = await response.json();
  const localizations = data.project.localizations;

  return localizations
    .map(({ locale }: PontoonData) => ({
      code: locale.code,
    }))
    .concat({ code: 'en', name: 'English', translated: 1, direction: 'LTR' })
    .sort((l1: Locale, l2: Locale) => l1.code.localeCompare(l2.code));
};

export async function importLocales() {
  console.log('Importing languages');
  const locales = await fetchPontoonLanguages();
  if (locales) {
    console.log('Inserting languages into database');

    await db.query('INSERT IGNORE INTO locales (name) VALUES ?', [
      locales.map(l => [l.code]),
    ]);

    // Make sure each language has at minimum an "unspecified" accent
    await db.query(`
    INSERT IGNORE INTO accents (locale_id, accent_name, accent_token, user_submitted)
    SELECT id, "", "unspecified", 0 from locales`);
  }
  console.log('Importing languages completed');
}
