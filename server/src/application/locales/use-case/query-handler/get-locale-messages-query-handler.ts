import * as path from 'path'
import {
  collectFilesWithExtension,
  getFolderNames,
  readAndConcatFiles,
  isFile,
} from '../../../../infrastructure/fs/fp-fs'
import { GetLocaleMessagesQuery } from '../query/get-locale-messages-query'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as IO from 'fp-ts/IO'
import { Project } from '../../../../core/types/project'

export const LOCALES_PATH = path.join(process.cwd(), 'web', 'locales')

export const getLocaleMessagesQueryHandler = (
  query: GetLocaleMessagesQuery
) => {
  const projectPath = path.join(LOCALES_PATH, query.project)

  const doesLocaleExist = pipe(
    getFolderNames(projectPath)(),
    A.some(name => name === query.locale)
  )

  const locale = doesLocaleExist ? query.locale : 'en'

  return pipe(
    collectFilesWithExtension(path.join(projectPath, locale), '.ftl'),
    IO.chain(addCommonTranslations(query.project, locale)),
    IO.chain(readAndConcatFiles)
  )()
}

const addCommonTranslations =
  (project: Project, locale: string) =>
    (translations: string[]): IO.IO<string[]> => {
      return () => {
        if (project === 'common-voice') {
          return translations
        }

        const languageNamesPath = path.join(
          LOCALES_PATH,
          'common-voice',
          locale,
          'pages',
          'common.ftl'
        )
        return isFile(languageNamesPath)()
          ? [...translations, languageNamesPath]
          : translations
      }
    }
