import { pipe } from 'fp-ts/lib/function'
import { validateSentence } from '../../../../core/pending-sentences'
import { insertSentenceIntoDb } from '../../repository/pending-sentences-repository'
import { AddPendingSentenceCommand } from './command/add-pending-sentence-command'
import { either as E, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import { createPendingSentenceValidationError } from '../../../helper/error-helper'
import { PendingSentenceSubmission } from '../../../types/pending-sentence-submission'

const createSentenceSubmissionFromCommand =
  (command: AddPendingSentenceCommand) =>
  (validatedSentence: string): PendingSentenceSubmission => ({
    client_id: command.clientId,
    locale_id: command.localeId,
    sentence: validatedSentence,
    source: command.source,
  })

export default (
  command: AddPendingSentenceCommand
): TE.TaskEither<ApplicationError, unknown> => {
  return pipe(
    command.sentence,
    validateSentence(command.localeName),
    E.mapLeft(createPendingSentenceValidationError),
    E.map(createSentenceSubmissionFromCommand(command)),
    E.map(insertSentenceIntoDb),
    TE.fromEither,
    TE.flatten
  )
}
