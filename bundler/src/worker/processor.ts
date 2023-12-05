import path from 'node:path'

import { Job } from 'bullmq'
import { readerTaskEither as RTE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { runFetchAllClipsForLocale } from '../core/clips'
import { isMinorityLanguage } from '../core/ruleOfFive'
import { AppEnv, ProcessLocaleJob } from '../types'
import { runCorporaCreator } from '../infrastructure/corporaCreator'
import { runCompress } from '../core/compress'
import { runMp3DurationReporter } from '../infrastructure/mp3DurationReporter'
import { runStats } from '../core/stats'
import { runReportedSentences } from '../core/reportedSentences'
import { runUpload } from '../core/upload'
import { runCleanUp } from '../core/cleanUp'

const processPipeline = pipe(
  RTE.Do,
  RTE.bind('isMinorityLanguage', isMinorityLanguage),
  RTE.chainFirst(({ isMinorityLanguage }) =>
    runFetchAllClipsForLocale(isMinorityLanguage),
  ),
  RTE.bind('totalDurationInMs', runMp3DurationReporter),
  RTE.chainFirst(runCorporaCreator),
  RTE.chainFirst(runReportedSentences),
  RTE.bind('tarFilepath', runCompress),
  RTE.bind('uploadPath', ({ tarFilepath }) => runUpload(tarFilepath)),
  RTE.bind('stats', ({ totalDurationInMs, tarFilepath }) =>
    runStats(totalDurationInMs, tarFilepath),
  ),
  RTE.chainFirst(({ tarFilepath }) => runCleanUp(tarFilepath)),
)

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  const { locale, releaseName } = job.data
  const releaseDirPath = path.join(__dirname, '..', '..', releaseName)
  const env: AppEnv = {
    ...job.data,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
  }
  await processPipeline(env)()
}
