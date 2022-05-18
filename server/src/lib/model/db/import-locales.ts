import fetch from 'node-fetch';
import { getMySQLInstance } from './mysql';
const TRANSLATED_MIN_PROGRESS = 0.6;
const DEFAULT_TARGET_SENTENCE_COUNT = 5000;

type Locale = {
  code: string;
  direction: string;
  name: string;
  translated: boolean;
};
interface PontoonData {
  locale: Locale;
  totalStrings: number;
  approvedStrings: number;
}

const db = getMySQLInstance();

const fetchPontoonLanguages = async (): Promise<any[]> => {
  const url =
    'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}';
  const response = await fetch(url);
  const { data } = await response.json();
  const localizations: PontoonData[] = data.project.localizations;

  return localizations
    .map(({ totalStrings, approvedStrings, locale }) => ({
      code: locale.code,
      name: locale.name,
      translated: approvedStrings / totalStrings,
      direction: locale.direction,
    }))
    .concat({ code: 'en', name: 'English', translated: 1, direction: 'LTR' })
    .sort((l1, l2) => l1.code.localeCompare(l2.code));
};

export async function importLocales() {
  console.log('Importing languages');
  const locales = await fetchPontoonLanguages();

  if (locales) {
    const [existingLangauges] = await db.query(`
      SELECT t.locale_id as has_clips, l.id, l.name, l.target_sentence_count as target_sentence_count, count(1) as total_sentence_count
      FROM locales l
      LEFT JOIN sentences s ON s.locale_id = l.id
      LEFT JOIN (SELECT c.locale_id FROM clips c group by c.locale_id) t on t.locale_id = s.locale_id
      GROUP BY l.id
    `);

    console.log(`${existingLangauges.length} Existing Languages`);

    const languagesWithClips = existingLangauges.reduce(
      (obj: any, language: any) => {
        if (language.has_clips) obj[language.name] = true;
        return obj;
      }
    );

    const allLanguages = existingLangauges.reduce((obj: any, language: any) => {
      obj[language.name] = {
        ...language,
        hasEnoughSentences:
          language.total_sentence_count >= language.target_sentence_count,
      };
      return obj;
    }, {});

    const newLanguageData = locales.reduce((obj, language) => {
      const isTranslated = language.translated >= TRANSLATED_MIN_PROGRESS;
      const hasEnoughSentences =
        allLanguages[language.code]?.hasEnoughSentences || false;
      const is_contributable = languagesWithClips[language.code]
        ? 1
        : isTranslated && hasEnoughSentences
        ? 1
        : 0;
      obj[language.code] = {
        ...language,
        target_sentence_count:
          allLanguages[language.code]?.target_sentence_count ||
          DEFAULT_TARGET_SENTENCE_COUNT,
        is_translated: isTranslated ? 1 : 0,
        is_contributable,
      };
      return obj;
    }, {});

    await Promise.all([
      locales.map(lang => {
        if (allLanguages[lang.code]) {
          // this language exists in db, just update
          return db.query(
            `
            UPDATE locales
            SET native_name = ?,
            is_contributable = ?, 
            is_translated = ?, 
            text_direction = ?
            WHERE id = ?
            `,
            [
              lang.name,
              newLanguageData[lang.code].is_contributable,
              newLanguageData[lang.code].is_translated,
              lang.direction,
              allLanguages[lang.code].id,
            ]
          );
        } else {
          // this is a new language, insert
          return db.query(
            `INSERT IGNORE INTO locales(name, target_sentence_count, native_name, is_contributable, is_translated, text_direction) VALUES (?)`,
            [
              [
                lang.code,
                newLanguageData[lang.code].target_sentence_count,
                lang.name,
                newLanguageData[lang.code].is_contributable,
                newLanguageData[lang.code].is_translated,
                lang.direction,
              ],
            ]
          );
        }
      }),
    ]);
    // Make sure each language has at minimum an "unspecified" accent
    await db.query(`
    INSERT IGNORE INTO accents (locale_id, accent_name, accent_token, user_submitted)
    SELECT id, "", "unspecified", 0 from locales`);
  }
  console.log('Importing languages completed');
}
