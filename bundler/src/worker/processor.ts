import path from 'node:path'
import fs from 'node:fs'
import { pipe } from 'fp-ts/lib/function'
import { fetchAllClipsForLocale } from '../core/clips'
import { isMinorityLanguage } from '../core/ruleOfFive'
import { ProcessLocaleJob } from '../types'
import { io as IO, taskEither as TE } from 'fp-ts'
import { Job } from 'bullmq'
import { getReleaseBasePath } from '../config/config'

const prepareDir =
  (locale: string): IO.IO<void> =>
  () => {
    const dirPath = path.join(getReleaseBasePath(), locale, 'clips')
    console.log(`Creating ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  }

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  const locale = job.data.locale
  console.log('Starting to process locale', locale)

  await pipe(
    TE.Do,
    TE.bind('isMinorityLanguage', () => isMinorityLanguage(locale)),
    TE.tap(() => TE.fromIO(prepareDir(locale))),
    TE.tap(({ isMinorityLanguage }) =>
      fetchAllClipsForLocale(locale, isMinorityLanguage),
    ),
  )()

  // query db for all clips
  // download all clips from storage
  // create clips.tsv
  // create splits with corpora creator
}
