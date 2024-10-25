import fetch from 'node-fetch'
import { getMySQLInstance } from './mysql'
import { parse } from '@fluent/syntax'
import * as path from 'path'
import * as fs from 'fs'

const TRANSLATED_MIN_PROGRESS = 0.6
const DEFAULT_TARGET_SENTENCE_COUNT = 5000

const localeMessagesPath = path.join(
  __dirname,
  '../../../../../',
  'web',
  'locales'
)

type Variant = {
  id?: number
  variant_name?: string
  variant_token: string
  locale_name?: string
}

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
  {
    locale_name: 'ca',
    variant_name: 'Central',
    variant_token: 'ca-central',
  },
  {
    locale_name: 'ca',
    variant_name: 'Balear',
    variant_token: 'ca-balear',
  },
  {
    locale_name: 'ca',
    variant_name: 'Nord-Occidental',
    variant_token: 'ca-nwestern',
  },
  {
    locale_name: 'ca',
    variant_name: 'Septentrional',
    variant_token: 'ca-northern',
  },
  {
    locale_name: 'ca',
    variant_name: 'Tortosí',
    variant_token: 'ca-valencia-tortosi',
  },
  {
    locale_name: 'ca',
    variant_name: 'Valencià central',
    variant_token: 'ca-valencia-central',
  },
  {
    locale_name: 'ca',
    variant_name: 'Valencià septentrional',
    variant_token: 'ca-valencia-northern',
  },
  {
    locale_name: 'ca',
    variant_name: 'Valencià meridional',
    variant_token: 'ca-valencia-southern',
  },
  {
    locale_name: 'ca',
    variant_name: 'Alacantí',
    variant_token: 'ca-valencia-alacant',
  },
  {
    locale_name: 'ca',
    variant_name: 'Alguerès',
    variant_token: 'ca-algueres',
  },
  {
    locale_name: 'zgh',
    variant_name: 'ⵜⴰⵛⵍⵃⵉⵜ (Tachelhit)',
    variant_token: 'zgh-shi',
  },
  {
    locale_name: 'zgh',
    variant_name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ ⵏ ⵡⴰⵟⵍⴰⵚ ⴰⵏⴰⵎⵎⴰⵙ (Central Atlas Tamazight)',
    variant_token: 'zgh-tzm',
  },
  {
    locale_name: 'zgh',
    variant_name: 'ⵜⴰⵔⵉⴼⵉⵜ (Tarifit)',
    variant_token: 'zgh-rif',
  },
  {
    locale_name: 'tui',
    variant_name: 'Ɓaŋwere (Tupuri Bangwere)',
    variant_token: 'tui-bangwere',
  },
  {
    locale_name: 'tui',
    variant_name: 'Ɓaŋgɔ̀ (Tupuri Banggo)',
    variant_token: 'tui-banggo',
  },
  {
    locale_name: 'tn',
    variant_name: 'Central Setswana (Sehurutshe, Sengwaketse, Serolong)',
    variant_token: 'tn-central',
  },
  {
    locale_name: 'tn',
    variant_name: 'Northern Setswana (Sengwato, Setawana, Sekwena, Selete)',
    variant_token: 'tn-northern',
  },
  {
    locale_name: 'tn',
    variant_name: 'Eastern Setswana (Sekgatla, Setlokwa)',
    variant_token: 'tn-eastern',
  },
  {
    locale_name: 'tn',
    variant_name: 'Southern Setswana (Setlhaping, Setlharo)',
    variant_token: 'tn-southern',
  },
  {
    locale_name: 'ady',
    variant_name: 'Адыгабзэ (Кирил, Урысый)',
    variant_token: 'ady-RU',
  },
  {
    locale_name: 'ady',
    variant_name: 'Адыгабзэ (Кирил, Тырку - Batı Çerkesçesi)',
    variant_token: 'ady-Cyrl-TR',
  },
  {
    locale_name: 'ady',
    variant_name: 'Adığabze (Latin, Turk, transliteratse - Batı Çerkesçesi)',
    variant_token: 'ady-Latn-TR-t-ady-cyrl-tr',
  },
  {
    locale_name: 'ady',
    variant_name: 'Адыгабзэ (Кирил, Иордание)',
    variant_token: 'ady-Cyrl-JOR',
  },
  {
    locale_name: 'ady',
    variant_name: 'Адыгабзэ (Кирил, Сирие)',
    variant_token: 'ady-Cyrl-SY',
  },
  {
    locale_name: 'kbd',
    variant_name: 'Адыгэбзэ (Къэбэрдей, Кирил, Урысей)',
    variant_token: 'kbd-RU',
  },
  {
    locale_name: 'kbd',
    variant_name: 'Адыгэбзэ (Къэбэрдей, Кирил, Тырку - Doğu Çerkesçesi)',
    variant_token: 'kbd-Cyrl-TR',
  },
  {
    locale_name: 'kbd',
    variant_name: 'Adığebze (Kabardey, Latin, Turk, transliteratse - Doğu Çerkesçesi)',
    variant_token: 'kbd-Latn-TR-t-kbd-cyrl-tr',
  },
  {
    locale_name: 'kbd',
    variant_name: 'Адыгэбзэ (Къэбэрдей, Кирил, Иордание)',
    variant_token: 'kbd-Cyrl-JOR',
  },
  {
    locale_name: 'kbd',
    variant_name: 'Адыгэбзэ (Къэбэрдей, Кирил, Сирие)',
    variant_token: 'kbd-Cyrl-SY',
  },
]

type Locale = {
  code: string
  direction: string
  name: string
  translated: boolean
}
interface PontoonData {
  locale: Locale
  totalStrings: number
  approvedStrings: number
}

const db = getMySQLInstance()

const saveToMessages = (languages: any) => {
  const messagesPath = path.join(
    localeMessagesPath,
    'en',
    'pages',
    'common.ftl'
  )
  const messages = fs.readFileSync(messagesPath, 'utf-8')

  const newMessages = messages.replace(
    /#\s\[Languages]([\s\S]*?)#\s\[\/]/gm,
    [
      '# [Languages]',
      '## Languages',
      languages.map(({ code, name }: any) => `${code} = ${name}`).join('\n'),
      '# [/]',
    ].join('\n')
  )
  fs.writeFileSync(messagesPath, newMessages)
}

const buildLocaleNativeNameMapping: any = () => {
  const locales = fs.readdirSync(localeMessagesPath)
  const nativeNames: {
    [code: string]: string
  } = {}
  for (const locale of locales) {
    const messagesPath = path.join(
      localeMessagesPath,
      locale,
      'pages',
      'common.ftl'
    )

    if (!fs.existsSync(messagesPath)) {
      continue
    }

    const messages: any = parse(fs.readFileSync(messagesPath, 'utf-8'), {})
    const message = messages.body.find(
      (message: any) => message.id && message.id.name === locale
    )

    nativeNames[locale] = message ? message.value.elements[0].value : locale
  }
  return nativeNames
}

function readFilesInDirectory(
  dirPath: string
): { fileName: string; content: string }[] {
  try {
    const files = fs.readdirSync(dirPath)
    const fileContents: { fileName: string; content: string }[] = []

    files.forEach(file => {
      const filePath = path.join(dirPath, file)
      const data = fs.readFileSync(filePath, 'utf8')
      fileContents.push({ fileName: file, content: data })
    })

    return fileContents
  } catch (err) {
    throw new Error(`Error reading files in directory: ${err.message}`)
  }
}

const getMinimalTranslationResources = (locale: string) => {
  let contributePages
  let contributePagesResources

  try {
    contributePages = readFilesInDirectory(
      path.join(localeMessagesPath, locale, 'pages', 'contribute')
    )
    contributePagesResources = contributePages.map(page =>
      parse(page.content, {})
    )
  } catch {
    contributePagesResources = [parse('', {})]
  }

  return {
    contributePages: contributePagesResources,
  }
}

const minimalTranslation = (locale: string) => {
  const refMinimalResources = getMinimalTranslationResources('en')
  const targetMinimalResources = getMinimalTranslationResources(locale)

  const refContributePageCount = refMinimalResources.contributePages.reduce(
    (acc, curr) => {
      return acc + curr.body.length
    },
    0
  )

  const targetContributePageCount =
    targetMinimalResources.contributePages.reduce((acc, curr) => {
      return acc + curr.body.length
    }, 0)

  return refContributePageCount === targetContributePageCount
}

const fetchPontoonLanguages = async (): Promise<any[]> => {
  const url =
    'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}'
  const response = await fetch(url)
  const { data } = await response.json()
  const localizations: PontoonData[] = data.project.localizations

  return localizations
    .map(({ totalStrings, approvedStrings, locale }) => {
      return {
        code: locale.code,
        name: locale.name,
        translated: approvedStrings / totalStrings,
        hasRequiredTranslations: minimalTranslation(locale.code),
        direction: locale.direction,
      }
    })
    .concat({
      code: 'en',
      name: 'English',
      translated: 1,
      hasRequiredTranslations: true,
      direction: 'LTR',
    })
    .sort((l1, l2) => l1.code.localeCompare(l2.code))
}

const fetchExistingLanguages = async () => {
  const [existinglanguages] = await db.query(`
      select t.locale_id as has_clips, l.id, l.name, l.target_sentence_count as target_sentence_count, count(1) as total_sentence_count
      from locales l
      left join sentences s on s.locale_id = l.id
      left join (select c.locale_id from clips c group by c.locale_id) t on t.locale_id = s.locale_id
      group by l.id
    `)
  return existinglanguages
}

export async function importLocales() {
  console.log('Importing languages...')
  const locales = await fetchPontoonLanguages()
  console.log('Got Pontoon Languages')
  const nativeNames = buildLocaleNativeNameMapping()
  console.log('Built native names')
  saveToMessages(locales)
  console.log('Saved native names to message file')

  if (locales) {
    console.log('Fetching existing languages')

    const existingLangauges = await fetchExistingLanguages()

    console.log(`${existingLangauges.length} Existing Languages`)

    const languagesWithClips = existingLangauges.reduce(
      (obj: any, language: any) => {
        if (language.has_clips) obj[language.name] = true
        return obj
      }
    )

    const allLanguages = existingLangauges.reduce((obj: any, language: any) => {
      obj[language.name] = {
        ...language,
        hasEnoughSentences:
          language.total_sentence_count >= language.target_sentence_count,
      }
      return obj
    }, {})

    const newLanguageData = locales.reduce((obj, language) => {
      // if a lang has clips, or has the required translations,
      // consider it translated
      const isTranslated = languagesWithClips[language.code]
        ? 1
        : language.hasRequiredTranslations
        ? 1
        : language.translated >= TRANSLATED_MIN_PROGRESS //no previous clips, check if criteria met
        ? 1
        : 0

      const hasEnoughSentences =
        allLanguages[language.code]?.hasEnoughSentences || false

      //if a lang has clips, consider it contributable
      const is_contributable = languagesWithClips[language.code]
        ? 1
        : isTranslated && hasEnoughSentences // no prev clips, check translated and enough sentences
        ? 1
        : 0

      obj[language.code] = {
        ...language,
        target_sentence_count:
          allLanguages[language.code]?.target_sentence_count ||
          DEFAULT_TARGET_SENTENCE_COUNT,
        is_translated: isTranslated ? 1 : 0,
        is_contributable,
      }
      return obj
    }, {})

    console.log('Saving language data to database')

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
          )
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
          )
        }
      })
    )
    console.log('Saving accents to database')

    // Make sure each language has at minimum an "unspecified" accent
    await db.query(`
    INSERT IGNORE INTO accents (locale_id, accent_name, accent_token, user_submitted)
    SELECT id, "", "unspecified", 0 from locales`)

    console.log('Saving variants to database')

    //get languages again, since new langauges may have been added
    const [languageQuery] = await db.query(
      `SELECT id, name FROM locales where name is not null`
    )

    //reshape query results into object
    const mappedLanguages = languageQuery.reduce(
      (obj: any, current: { id: string; name: string }) => {
        obj[current.name] = current.id
        return obj
      },
      {}
    )

    await Promise.all(
      VARIANTS.map(row => {
        const langId = mappedLanguages[row.locale_name]
        //return early if language is not found in database
        if (!langId) return
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
        )
      })
    )
    console.log('Importing variants completed')
  }
  console.log('Importing languages completed')
}
