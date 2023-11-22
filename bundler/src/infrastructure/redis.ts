import { Redis } from 'ioredis'
import { taskEither as TE, option as O } from 'fp-ts'

const redis = new Redis({ host: 'redis' })

export const GET = (key: string) => {
  return TE.tryCatch(
    async () => O.fromNullable(await redis.get(key)),
    (reason) => Error(String(reason))
  )
}

export const SET = (key: string) => (value: string) => {
  return TE.tryCatch(
    () => redis.set(key, value),
    (reason) => Error(String(reason))
  )
}

export const SETNX = (key: string) => (value: string) => {
  return TE.tryCatch(
    () => redis.setnx(key, value),
    (reason) => Error(String(reason))
  )
}

export const DEL = (key: string) => {
  return TE.tryCatch(
    () => redis.del(key),
    (reason) => Error(String(reason))
  )
}
