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
    TE.chainFirst(({ locale }) => runMp3DurationReporter(locale)),
    TE.chainFirst(({ locale }) => runCorporaCreator(locale)),
    TE.chainFirst(({ locale }) => runCompress(locale)),
    TE.chainFirst(({ locale }) => runStats(locale)),
    TE.mapError(err => console.log(String(err))),
  )()

  // query db for all clips
  // download all clips from storage
  // create clips.tsv
  // create splits with corpora creator
}
