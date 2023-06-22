/*
 * CV relies on Pontoon for translations, language statistics and metadata. As a result, when determining the launch vs in-progress status
 * of a language, CV uses the statistics to see if a language should be launched.
 *
 * Currently, CV only fetches Pontoon data on startup (that is, every time the node application starts aka once when deployed, or if the application is restarted)
 * which is not guaranteed to occur in a timely manner. As a result, languages can be held up being promoted and ultimately slows contributions for new languages.
 *
 * Thus, by creating a scheduled job which can query Pontoon and update language metadata, languages will not be subject to the unpredictable deploy cycles and
 * accept contributions much sooner to the actual
 *
 * In order for a language to be launched (and start collecting clips), it must meet two distinct criteria:
 *  - website text has at least 60% translations
 *  - sentence contributions >= predetermined sentence target
 *
 * Once a language has met the two criterion, it is launched (the flag "is_contributable" is set to true the database).
 */

import { Language } from 'common'
import database from '../model/db'

const TRANSLATION_CRITERIA_CUTOFF = 0.6
const DEFAULT_TARGET_SENTENCE_COUNT = 5000
const PONTOON_URL =
  'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}'

interface PontoonLanguage {
  code: string
  direction: string
  name: string
  translated: boolean
}
interface PontoonData {
  locale: PontoonLanguage
  totalStrings: number
  approvedStrings: number
}

const getPontoonLanguages = async (): Promise<PontoonData[]> => {
  const response = await fetch(PONTOON_URL)
  const {
    data: {
      project: { localizations },
    },
  } = await response.json()
  return localizations
}

const convertPontoonDataToLanguage = (
  pontoonData: PontoonData,
  language: Language
): Language => {
  const {
    totalStrings,
    approvedStrings,
    locale: { code, name, direction: text_direction },
  } = pontoonData

  const hasTranslationCriteria =
    approvedStrings / totalStrings >= TRANSLATION_CRITERIA_CUTOFF
  //returns the new language data in a single object, ready to be saved to db
  return {
    ...language,
    name: code,
    native_name: name,
    text_direction,
    is_translated: hasTranslationCriteria,
  }
}

const mapToLanguages = (
  localizations: PontoonData[],
  languages: Language[]
): Language[] => {
  return localizations.map(localization => {
    const language = languages.find(
      lang => lang.name === localization.locale.code
    ) //realistically, this should be a obj with locale token as key and Language as value

    return convertPontoonDataToLanguage(localization, language)
  })
}

export const saveData = () => {
  // console.log(formatPontoonData(TEST_DATA))
}

export const syncPontoonStatistics = async () => {
  const existingLanguages = await database.getLanguages()
  const pontoonLanguages = await getPontoonLanguages()

  const languages = mapToLanguages(pontoonLanguages, existingLanguages)
}
