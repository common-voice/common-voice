import { pipe } from 'fp-ts/lib/function'
import { Sentence, validateSentence } from '../../../../core/sentence-collector'
import { insertSentenceIntoDb } from '../../repository/sentence-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import { either as E, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import { createScSentenceValidationError } from '../../../helper/error-helper'

const createSentenceFromCommand =
  (command: AddSentenceCommand) =>
  (validatedSentence: string): Sentence => ({
    client_id: command.clientId,
    locale_id: command.localeId,
    sentence: validatedSentence,
    source: command.source,
  })

export default (
  command: AddSentenceCommand
): TE.TaskEither<ApplicationError, unknown> => {
  return pipe(
    command.sentence,
    validateSentence(command.localeName),
    E.mapLeft(createScSentenceValidationError),
    E.map(createSentenceFromCommand(command)),
    E.map(insertSentenceIntoDb),
    TE.fromEither,
    TE.flatten
  )
}
