import 'dotenv/config'
import { addJobs } from './infrastructure/queue'
import { createWorker } from './worker/worker'
import { DEL, SETNX } from './infrastructure/redis'
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

const releaseLock = pipe(
   DEL,
   Id.ap(RESOURCE)
)

const createJobs = pipe(
   TE.Do,
   TE.bind('lockAcquired', () => acquireLock),
   TE.tap(({lockAcquired}) => lockAcquired ? TE.of(console.log(`${WORKER_ID} is leader`)) : TE.of(constVoid())),
   TE.chain(({ lockAcquired }) => lockAcquired 
      ? pipe(
         TE.Do,
         TE.chain(() => addJobs),
         TE.chain(() => releaseLock),
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
