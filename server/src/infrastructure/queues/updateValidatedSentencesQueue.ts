import { pipe } from 'fp-ts/lib/function'
import { io as IO } from 'fp-ts'
import {
  addJobToQueue,
  addSandboxedProcessorToQueue,
  attachEventHandlerToQueue,
  getQueue,
} from './queues'
import {
  ValidateSentencesJob,
  UPDATE_VALIDATED_SENTENCES_JOB,
} from './types/ValidateSentencesJob'

const UPDATE_VALIDATED_SENTENCES_QUEUE_NAME = 'update-validated-sentences-queue'

const REPEAT_EVERY_HOUR = '0 * * * *'

export const setupUpdateValidatedSentencesQueue = () => {
  pipe(
    getQueue<ValidateSentencesJob>(UPDATE_VALIDATED_SENTENCES_QUEUE_NAME),
    IO.chainFirst(
      addSandboxedProcessorToQueue(
        `${__dirname}/processors/updateValidatedSentencesProcessor.js`
      )
    ),
    IO.chainFirst(attachEventHandlerToQueue('error')(console.error)),
    IO.chainFirst(attachEventHandlerToQueue('failure')(console.error)),
    IO.chainFirst(
      attachEventHandlerToQueue('completed')(() =>
        console.log(`Finished ${UPDATE_VALIDATED_SENTENCES_JOB} job`)
      )
    ),
    IO.chainFirst(
      addJobToQueue({ name: UPDATE_VALIDATED_SENTENCES_JOB })(UPDATE_VALIDATED_SENTENCES_JOB)({
        repeat: { cron: REPEAT_EVERY_HOUR },
      })
    )
  )()
}
