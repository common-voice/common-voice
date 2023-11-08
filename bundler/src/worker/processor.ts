import { pipe } from 'fp-ts/lib/function'
import { runFetchAllClipsForLocale } from '../core/clips'
import { isMinorityLanguage } from '../core/ruleOfFive'
import { ProcessLocaleJob } from '../types'
import { taskEither as TE } from 'fp-ts'
import { Job } from 'bullmq'
import { runCorporaCreator } from '../infrastructure/corporaCreator'
import { runCompress } from '../core/compress'
import { runMp3DurationReporter } from '../infrastructure/mp3DurationReporter'
import { runStats } from '../core/stats'
import { runReportedSentences } from '../core/reportedSentences'
import { runUpload } from '../core/upload'

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  await pipe(
    TE.Do,
    TE.let('locale', () => job.data.locale),
    TE.chainFirst(({ locale }) =>
      TE.of(console.log('Starting to process locale', locale)),
    ),
    TE.bind('isMinorityLanguage', ({ locale }) => isMinorityLanguage(locale)),
    TE.chainFirst(({ locale, isMinorityLanguage }) =>
      runFetchAllClipsForLocale(locale, isMinorityLanguage),
    ),
    TE.bind('totalDurationInMs', ({ locale }) =>
      runMp3DurationReporter(locale),
    ),
    TE.tap(({ totalDurationInMs }) =>
      TE.of(console.log('thats the duraton', totalDurationInMs)),
    ),
    TE.chainFirst(({ locale }) => runCorporaCreator(locale)),
    TE.chainFirst(({ locale }) => runReportedSentences(locale)),
    TE.bind('tarFilepath', ({ locale }) => runCompress(locale)),
    TE.bind('uploadPath', ({ tarFilepath }) => runUpload(tarFilepath)),
    TE.chainFirst(({ locale, totalDurationInMs, tarFilepath }) =>
      runStats(locale, totalDurationInMs, tarFilepath),
    ),
    TE.mapError(err => console.log(String(err))),
  )()
}
