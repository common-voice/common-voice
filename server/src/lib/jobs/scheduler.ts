import * as Queue from 'bull'
import { syncPontoonLanguageStatistics } from './sync-pontoon-statistics'
import { getRedisConfig } from '../queues/imageQueue'

const QUEUE_OPTIONS = {
  NAMES: {
    STATISTICS: 'stats',
  },
}

const SCHEDULE_OPTIONS = {
  repeat: {
    every: 10000,
  },
}

export const statisticsQueue = new Queue(
  QUEUE_OPTIONS.NAMES.STATISTICS,
  'redis',
  {
    redis: getRedisConfig(),
  }
)

statisticsQueue.process(QUEUE_OPTIONS.NAMES.STATISTICS, async (job, done) => {
  console.log('Running Pontoon Language Statistics Synchronization', job.data)
  try {
    await syncPontoonLanguageStatistics()
    done()
  } catch (error) {
    done(error)
  }
})

export const scheduler = () => {
  statisticsQueue.add(
    QUEUE_OPTIONS.NAMES.STATISTICS,
    {}
    // SCHEDULE_OPTIONS
  )
}
