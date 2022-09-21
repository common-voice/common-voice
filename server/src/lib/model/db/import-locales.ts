import fetch from 'node-fetch';
import { getMySQLInstance } from './mysql';
import { parse } from '@fluent/syntax';
import * as path from 'path';
import * as fs from 'fs';

const TRANSLATED_MIN_PROGRESS = 0.6;
const DEFAULT_TARGET_SENTENCE_COUNT = 5000;

const localeMessagesPath = path.join(
  __dirname,
  '../../../../../',
  'web',
  'locales'
);

type Variant = {
  id?: number;
  variant_name?: string;
  variant_token: string;
  locale_name?: string;
};

const VARIANTS: Variant[] = [
  {
    locale_name: 'cy',
    variant_name: 'North-Western Welsh',
    variant_token: 'cy-northwes',
  },
  {
    locale_name: 'cy',
    variant_name: 'North-Eastern Welsh',
    variant_token: 'cy-northeas',
  },
  {
    locale_name: 'cy',
    variant_name: 'Mid Wales',
    variant_token: 'cy-midwales',
  },
  {
    locale_name: 'cy',
    variant_name: 'South-Western Welsh',
    variant_token: 'cy-southwes',
  },
  {
    locale_name: 'cy',
    variant_name: 'South-Eastern Welsh',
    variant_token: 'cy-southeas',
  },
  {
    locale_name: 'cy',
    variant_name: 'Patagonian Welsh',
    variant_token: 'cy-wladfa',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili Sanifu (EA)',
    variant_token: 'sw-sanifu',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili cha Bara ya Kenya',
    variant_token: 'sw-barake',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili cha Bara ya Tanzania',
    variant_token: 'sw-baratz',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kingwana (DRC)',
    variant_token: 'sw-kingwana',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimvita (KE) - Central dialect',
    variant_token: 'sw-kimvita',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kibajuni (KE) - Northern dialect',
    variant_token: 'sw-kibajuni',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimrima (TZ) - Northern dialect',
    variant_token: 'sw-kimrima',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiunguja (TZ) - Southern dialect',
    variant_token: 'sw-kiunguja',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kipemba (TZ) - Southern dialect',
    variant_token: 'sw-kipemba',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimakunduchi/Kikae (TZ) - Southern dialect',
    variant_token: 'sw-kikae',
  },
  {
    locale_name: 'pt',
    variant_name: 'Portuguese (Brasil)',
    variant_token: 'pt-BR',
  },
  {
    locale_name: 'pt',
    variant_name: 'Portuguese (Portugal)',
    variant_token: 'pt-PT',
  },
];

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

const saveToMessages = (languages: any) => {
  const messagesPath = path.join(localeMessagesPath, 'en', 'messages.ftl');
  const messages = fs.readFileSync(messagesPath, 'utf-8');

  const newMessages = messages.replace(
    /#\s\[Languages]([\s\S]*?)#\s\[\/]/gm,
    [
      '# [Languages]',
      '## Languages',
      languages.map(({ code, name }: any) => `${code} = ${name}`).join('\n'),
      '# [/]',
    ].join('\n')
  );
  fs.writeFileSync(messagesPath, newMessages);
};

const buildLocaleNativeNameMapping: any = () => {
  const locales = fs.readdirSync(localeMessagesPath);
  const nativeNames: {
    [code: string]: string;
  } = {};
  for (const locale of locales) {
    const messagesPath = path.join(localeMessagesPath, locale, 'messages.ftl');

    if (!fs.existsSync(messagesPath)) {
      continue;
    }

    const messages: any = parse(fs.readFileSync(messagesPath, 'utf-8'), {});
    const message = messages.body.find(
      (message: any) => message.id && message.id.name === locale
    );

    nativeNames[locale] = message ? message.value.elements[0].value : locale;
  }
  return nativeNames;
};

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
  console.log('Importing languages...');
  const locales = await fetchPontoonLanguages();
  console.log('Got Pontoon Languages');
  const nativeNames = buildLocaleNativeNameMapping();
  console.log('Built native names');
  saveToMessages(locales);
  console.log('Saved native names to message file');

  if (locales) {
    console.log('Fetching existing languages');

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
      //if a lang has clips, consider it translated
      const isTranslated = languagesWithClips[language.code]
        ? 1
        : language.translated >= TRANSLATED_MIN_PROGRESS //no previous clips, check if criteria met
        ? 1
        : 0;

      const hasEnoughSentences =
        allLanguages[language.code]?.hasEnoughSentences || false;

      //if a lang has clips, consider it contributable
      const is_contributable = languagesWithClips[language.code]
        ? 1
        : isTranslated && hasEnoughSentences // no prev clips, check translated and enough sentences
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

    console.log('Saving language data to database');

    await Promise.all(
      locales.map(async lang => {
        if (allLanguages[lang.code]) {
          // this language exists in db, just update
          return await db.query(
            `
            UPDATE locales
            SET native_name = ?,
            is_contributable = ?, 
            is_translated = ?, 
            text_direction = ?
            WHERE id = ?
            `,
            [
              nativeNames[lang.code] ? nativeNames[lang.code] : lang.code,
              newLanguageData[lang.code].is_contributable,
              newLanguageData[lang.code].is_translated,
              lang.direction,
              allLanguages[lang.code].id,
            ]
          );
        } else {
          // this is a new language, insert
          return await db.query(
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
      })
    );
    console.log('Saving accents to database');

    // Make sure each language has at minimum an "unspecified" accent
    await db.query(`
    INSERT IGNORE INTO accents (locale_id, accent_name, accent_token, user_submitted)
    SELECT id, "", "unspecified", 0 from locales`);

    console.log('Saving variants to database');

    //get languages again, since new langauges may have been added
    const [languageQuery] = await db.query(
      `SELECT id, name FROM locales where name is not null`
    );

    //reshape query results into object
    const mappedLanguages = languageQuery.reduce(
      (obj: any, current: { id: string; name: string }) => {
        obj[current.name] = current.id;
        return obj;
      },
      {}
    );

    await Promise.all(
      VARIANTS.map(row => {
        const langId = mappedLanguages[row.locale_name];
        //return early if language is not found in database
        if (!langId) return;
        return db.query(
          `
          INSERT IGNORE INTO variants (locale_id, variant_token, variant_name) VALUES (?)
        `,
          [
            [
              mappedLanguages[row.locale_name],
              row.variant_token,
              row.variant_name,
            ],
          ]
        );
      })
    );
    console.log('Importing variants completed');
  }
  console.log('Importing languages completed');
}
