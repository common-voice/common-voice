import { spawn } from 'node:child_process'
import { getReleaseBasePath } from '../config/config'
import path from 'node:path'
import { taskEither as TE } from 'fp-ts'

const runCorporaCreatorPromise = (locale: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('create-corpora', [
      '-d',
      path.join(getReleaseBasePath()),
      '-f',
      path.join(getReleaseBasePath(), locale, 'clips.tsv'),
    ])

    cc.stdout.on('data', data => console.log(`${data}`))
    cc.stderr.on('data', data => console.log(`${data}`))

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const runCorporaCreator = (locale: string) => {
  return TE.tryCatch(
    () => runCorporaCreatorPromise(locale),
    reason => Error(String(reason)),
  )
}
