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

const LOCALES_PATH = path.join(process.cwd(), 'web', 'locales')

export const getLocaleMessagesQueryHandler = (
  query: GetLocaleMessagesQuery
) => {
  console.log(LOCALES_PATH)

  const doesLocaleExist = pipe(
    getFolderNames(LOCALES_PATH)(),
    A.some(name => name === query.locale)
  )

  return pipe(
    collectFilesWithExtension(
      path.join(LOCALES_PATH, doesLocaleExist ? query.locale : 'en'),
      '.ftl'
    ),
    IO.chain(readAndConcatFiles)
  )()
}
