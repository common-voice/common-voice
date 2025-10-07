import fetch from 'node-fetch'
import { getMySQLInstance } from './mysql'
import { parse } from '@fluent/syntax'
import * as path from 'path'
import * as fs from 'fs'
import { VARIANTS } from './language-data/variants'
import { ACCENTS } from './language-data/accents'

const TRANSLATED_MIN_PROGRESS = 0.6
const DEFAULT_TARGET_SENTENCE_COUNT = 5000

const LOCALE_MESSAGES_PATH = path.join(
  __dirname,
  '../../../../../',
  'web',
  'locales',
  'common-voice'
)

type PontoonLocale = {
  locale: {
    code: string
    name: string
  }
  total_strings: number
  approved_strings: number
  pretranslated_strings: number
  strings_with_warnings: number
  strings_with_errors: number
  missing_strings: number
  unreviewed_strings: number
  complete: boolean
}

const db = getMySQLInstance()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveToMessages = (languages: any) => {
  const messagesPath = path.join(
    LOCALE_MESSAGES_PATH,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      languages.map(({ code, name }: any) => `${code} = ${name}`).join('\n'),
      '# [/]',
    ].join('\n')
  )
  fs.writeFileSync(messagesPath, newMessages)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildLocaleNativeNameMapping: any = () => {
  const locales = fs.readdirSync(LOCALE_MESSAGES_PATH)
  const nativeNames: {
    [code: string]: string
  } = {}
  for (const locale of locales) {
    const messagesPath = path.join(
      LOCALE_MESSAGES_PATH,
      locale,
      'pages',
      'common.ftl'
    )

    if (!fs.existsSync(messagesPath)) {
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any = parse(fs.readFileSync(messagesPath, 'utf-8'), {})
    const message = messages.body.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      path.join(LOCALE_MESSAGES_PATH, locale, 'pages', 'contribute')
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchPontoonLanguages = async (): Promise<any[]> => {
  try {
    // Fetch project data to get locale codes and translation stats
    const projectUrl =
      'https://pontoon.mozilla.org/api/v2/projects/common-voice/'
    const projectResponse = await fetch(projectUrl)

    if (!projectResponse.ok) {
      console.error(
        `Pontoon API responded with status: ${projectResponse.status}`
      )
      return []
    }

    const projectData = await projectResponse.json()
    const projectLocales: PontoonLocale[] = projectData.localizations

    // Fetch all locales with pagination to get direction information
    const allLocales = await fetchAllLocalesWithPagination()

    // Create a map for quick locale detail lookup
    const localeDetailsMap = new Map()
    allLocales.forEach(locale => {
      localeDetailsMap.set(locale.code, locale)
    })

    // Combine project data with locale details
    return projectLocales
      .map(projectLocale => {
        const localeDetails = localeDetailsMap.get(projectLocale.locale.code)
        return {
          code: projectLocale.locale.code,
          name: projectLocale.locale.name,
          translated: projectLocale.total_strings
            ? projectLocale.approved_strings / projectLocale.total_strings
            : 0,
          hasRequiredTranslations: minimalTranslation(
            projectLocale.locale.code
          ),
          direction: localeDetails
            ? (localeDetails.direction as string).toUpperCase()
            : 'LTR', // Fallback to 'LTR' if not found
        }
      })
      .concat({
        code: 'en',
        name: 'English',
        translated: 1,
        hasRequiredTranslations: true,
        direction: 'ltr',
      })
      .sort((l1, l2) => l1.code.localeCompare(l2.code))
  } catch (error) {
    console.error('Error fetching Pontoon languages:', error)
  }
}

// Helper function to handle pagination for locales endpoint
async function fetchAllLocalesWithPagination() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allExtracted: any[] = []
  let nextUrl = 'https://pontoon.mozilla.org/api/v2/locales/'

  while (nextUrl) {
    const response = await fetch(nextUrl)

    if (!response.ok) {
      console.error(
        `Pontoon Locales API endpoint responded with status: ${response.status}`
      )
      return []
    }

    const pageData = await response.json()

    // Add the current page's results to our collection
    if (pageData.results && Array.isArray(pageData.results)) {
      allExtracted = allExtracted.concat(pageData.results)
    }

    // Move to the next page
    nextUrl = pageData.next
  }

  return allExtracted
}

const fetchExistingLanguages = async () => {
  const [existinglanguages] = await db.query(`
      select
        t.locale_id as has_clips,
        l.id,
        l.name,
        l.target_sentence_count as target_sentence_count,
        count(1) as total_sentence_count,
        is_translated,
        is_contributable
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

    const existingLanguages = await fetchExistingLanguages()

    console.log(`${existingLanguages.length} Existing Languages`)

    const languagesWithClips = existingLanguages.reduce(
      (obj: any, language: any) => {
        if (language.has_clips) obj[language.name] = true
        return obj
      }
    )

    const allLanguages = existingLanguages.reduce((obj: any, language: any) => {
      obj[language.name] = {
        ...language,
        hasEnoughSentences:
          language.total_sentence_count >= language.target_sentence_count,
      }
      return obj
    }, {})

    const newLanguageData = locales.reduce((obj, language) => {
      // if a lang has clips, is already translated, or has the required translations,
      // consider it translated
      const isTranslated = languagesWithClips[language.code]
        ? 1
        : allLanguages[language.code]?.is_translated === 1
        ? 1
        : language.hasRequiredTranslations
        ? 1
        : language.translated >= TRANSLATED_MIN_PROGRESS //no previous clips, check if criteria met
        ? 1
        : 0

      const hasEnoughSentences =
        allLanguages[language.code]?.hasEnoughSentences || false

      // if a lang is set to be contributable or has clips, consider it contributable
      const is_contributable = allLanguages[language.code]?.is_contributable
        ? 1
        : languagesWithClips[language.code]
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
      ACCENTS.map(row => {
        const langId = mappedLanguages[row.locale_name]
        if (!langId) return
        return db.query(
          `INSERT IGNORE INTO accents(locale_id, accent_name, accent_token) VALUES (?,?,?)`,
          [langId, row.accent_name, row.accent_token]
        )
      })
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
