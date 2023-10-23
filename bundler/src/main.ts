import 'dotenv/config'
import { addJobs } from './infrastructure/queue'
import { createWorker } from './worker/worker'
import { SETNX } from './infrastructure/redis'
import { taskEither as TE, io as IO, identity as Id } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { randomUUID } from 'crypto'

const RESOURCE = 'lock:dataset-release-leader'
const WORKER_ID = randomUUID()

const acquireLock = pipe(
   SETNX,
   Id.ap(RESOURCE),
   Id.ap(WORKER_ID),
   TE.map((result) => result === 1 ? true : false)
)

const createJobs = pipe(
   TE.Do,
   TE.bind('lockAcquired', () => acquireLock),
   TE.chain(({ lockAcquired }) => lockAcquired 
      ? pipe(
         addJobs,
         TE.as(constVoid())
       )
      : TE.right(constVoid())
   ),
)

const main: IO.IO<void> = pipe(
   createWorker,
   IO.tap(() => 
      pipe(
         createJobs,
         TE.mapError((err) => console.log(err))
      )
   )
)

main()
