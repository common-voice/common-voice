import { pipe } from 'fp-ts/lib/function'
import { validateSentence } from '../../../../core/sentences'
import { insertSentenceIntoDb } from '../../repository/sentences-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import { either as E, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import { createSentenceValidationError } from '../../../helper/error-helper'
import { SentenceSubmission } from '../../../types/sentence-submission'

const createSentenceSubmissionFromCommand =
  (command: AddSentenceCommand) =>
  (validatedSentence: string): SentenceSubmission => ({
    client_id: command.clientId,
    locale_id: command.localeId,
    sentence: validatedSentence,
    source: command.source,
  })

export const AddSentenceCommandHandler = (
  command: AddSentenceCommand
): TE.TaskEither<ApplicationError, unknown> => {
  return pipe(
    command.sentence,
    validateSentence(command.localeName),
    E.mapLeft(createSentenceValidationError),
    E.map(createSentenceSubmissionFromCommand(command)),
    TE.fromEither,
    TE.chain(insertSentenceIntoDb)
  )
}
