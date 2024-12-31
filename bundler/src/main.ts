import 'dotenv/config'
import { createWorker } from './worker/worker'
import { io as IO } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

const main: IO.IO<void> = pipe(
   createWorker
)

main()
