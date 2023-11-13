import { pipe } from 'fp-ts/lib/function'
import { runFetchAllClipsForLocaleE } from '../core/clips'
import { isMinorityLanguageE } from '../core/ruleOfFive'
import { ProcessLocaleJob } from '../types'
import { Job } from 'bullmq'
import { runCorporaCreatorE } from '../infrastructure/corporaCreator'
import { runCompressE } from '../core/compress'
import { runMp3DurationReporterE } from '../infrastructure/mp3DurationReporter'
import { runStatsE } from '../core/stats'
import { runReportedSentences } from '../core/reportedSentences'
import { runUpload } from '../core/upload'
import * as RTE from 'fp-ts/readerTaskEither'

const processPipeline = pipe(
  RTE.Do,
  RTE.bind('isMinorityLanguage', isMinorityLanguageE),
  RTE.chainFirst(({ isMinorityLanguage }) =>
    runFetchAllClipsForLocaleE(isMinorityLanguage),
  ),
  RTE.bind('totalDurationInMs', runMp3DurationReporterE),
  RTE.chainFirst(runCorporaCreatorE),
  RTE.chainFirst(runReportedSentences),
  RTE.bind('tarFilepath', runCompressE),
  RTE.bind('uploadPath', ({ tarFilepath }) =>
    RTE.fromTaskEither(runUpload(tarFilepath)),
  ),
  RTE.chainFirst(({ totalDurationInMs, tarFilepath }) =>
    runStatsE(totalDurationInMs, tarFilepath),
  ),
)

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  await processPipeline(job.data)()
}
