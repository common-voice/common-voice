import * as Queue from 'bull'
import { CommonVoiceConfig, getConfig } from '../../config-helper'
import { io as IO, task as T } from 'fp-ts'
import { constVoid } from 'fp-ts/lib/function'

const getRedisConfig = (config: CommonVoiceConfig): Queue.QueueOptions => {
  const redisUrlParts = config.REDIS_URL?.split('//')

  if (!redisUrlParts) return { redis: { host: config.REDIS_URL } }

  const redisDomain =
    redisUrlParts.length > 1 ? redisUrlParts[1] : redisUrlParts[0]

  let redisOpts: any = { host: redisDomain }

  if (config.REDIS_URL.includes('rediss://')) {
    redisOpts = { ...redisOpts, tls: redisOpts }
  }

  return { redis: redisOpts }
}

export const createQueueWithOptions =
  (options: Queue.QueueOptions) =>
  <T>(name: string): IO.IO<Queue.Queue<T>> => {
    return IO.of(new Queue<T>(name, options))
  }

// Does not create a new queue but retrieves the existing one if present
export const getQueue = createQueueWithOptions(getRedisConfig(getConfig()))

export const addProcessorToQueue =
  <T>(processor: Queue.ProcessPromiseFunction<T>) =>
  (q: Queue.Queue<T>): IO.IO<void> => {
    q.process(processor)
    return IO.of(constVoid())
  }

export const attachEventHandlerToQueue =
  (event: string) =>
  <T>(errorHandler: (job: Queue.Job<T>) => any) =>
  (q: Queue.Queue<T>): IO.IO<void> => {
    return IO.of(q.on(event, errorHandler))
  }

export const addJobToQueue =
  <J>(job: J) =>
  (options: Queue.JobOptions) =>
  (q: Queue.Queue<J>): T.Task<boolean> =>
  async () => {
    await q.add(job, options)
    console.log(`Job added to queue ${q.name}`)
    return true
  }
