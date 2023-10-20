import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'

const datasetReleaseQueue = new Queue('datasetRelease', { connection: {
  host: 'redis' 
} })

export const addJobs = TE.tryCatch(
    async () => {
      await datasetReleaseQueue.add('processLocale', { locale: 'en', isMinorityLanguage: false })
      await datasetReleaseQueue.add('processLocale', { locale: 'de', isMinorityLanguage: false  })
      await datasetReleaseQueue.add('processLocale', { locale: 'fr', isMinorityLanguage: false  })
      await datasetReleaseQueue.add('processLocale', { locale: 'ca', isMinorityLanguage: true })
    },
    (err) => Error(String(err))
)
