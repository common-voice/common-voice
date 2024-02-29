import { pipe } from 'fp-ts/lib/function'
import { validateSentence } from '../../../../core/sentences'
import {
  insertSentenceIntoDb,
  findSentenceDomainByNameInDb,
} from '../../repository/sentences-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import {
  either as E,
  task as T,
  taskEither as TE,
  taskOption as TO,
} from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import { createSentenceValidationError } from '../../../helper/error-helper'
import { SentenceSubmission } from '../../../types/sentence-submission'

const createSentenceSubmissionFromCommand = (
  command: AddSentenceCommand
): E.Either<ApplicationError, SentenceSubmission> =>
  pipe(
    command.sentence,
    validateSentence(command.localeName),
    E.mapLeft(createSentenceValidationError),
    E.map(validatedSentence => ({
      client_id: command.clientId,
      locale_id: command.localeId,
      sentence: validatedSentence,
      source: command.source,
    }))
  )

export const AddSentenceCommandHandler = (
  command: AddSentenceCommand
): TE.TaskEither<ApplicationError, unknown> => {
  return pipe(
    TE.Do,
    TE.bind('sentenceSubmission', () =>
      TE.fromEither(createSentenceSubmissionFromCommand(command))
    ),
    TE.bind('domainId', () =>
      pipe(
        command.domain,
        findSentenceDomainByNameInDb,
        TO.getOrElseW(() => T.of(null)),
        TE.fromTask
      )
    ),
    TE.map(({ sentenceSubmission, domainId }): SentenceSubmission => {
      return {
        ...sentenceSubmission,
        domain_id: domainId,
      }
    }),
    TE.chain(sentenceSubmission => insertSentenceIntoDb(sentenceSubmission))
  )
}
