import * as Bull from 'bull'
import { syncPontoonLanguageStatistics } from './sync-pontoon-statistics'
import { getRedisConfig } from '../queues/imageQueue'

// Queue related settings
const SCHEDULER_QUEUE = {
  NAMES: {
    STATISTICS: 'statistics',
  },
  JOBS: {
    PONTOON_LANGUAGE_SYNC: 'pontoon-language-sync',
  },
  OPTIONS: {
    repeat: {
      every: 10000,
    },
  },
}

export const schedulerQueue = new Bull(
  SCHEDULER_QUEUE.NAMES.STATISTICS,
  'redis',
  {
    redis: getRedisConfig(),
  }
)

schedulerQueue.process(SCHEDULER_QUEUE.JOBS.PONTOON_LANGUAGE_SYNC, job => {
  console.log('Running Pontoon Language Statistics Synchronization', job.id)
  return syncPontoonLanguageStatistics()
})

schedulerQueue.on('error', console.error)
schedulerQueue.on('failed', console.error)

export const scheduler = () => {
  schedulerQueue.add(
    SCHEDULER_QUEUE.JOBS.PONTOON_LANGUAGE_SYNC,
    SCHEDULER_QUEUE.OPTIONS
  )
}
