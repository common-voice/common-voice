import * as path from 'path'
import {
  collectFilesWithExtension,
  getFolderNames,
  readAndConcatFiles,
} from '../../../../infrastructure/fs/fp-fs'
import { GetLocaleMessagesQuery } from '../query/get-locale-messages-query'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as IO from 'fp-ts/IO'

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
    IO.chain(readAndConcatFiles)
  )()
}
