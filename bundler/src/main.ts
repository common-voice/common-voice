import 'dotenv/config'
import { createWorker } from './worker/worker'
import * as IO from 'fp-ts/io'
import { pipe } from 'fp-ts/lib/function'

const main: IO.IO<void> = pipe(
   createWorker
)

main()
