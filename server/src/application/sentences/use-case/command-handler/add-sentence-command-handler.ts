import { pipe } from 'fp-ts/lib/function'
import { validateSentence } from '../../../../core/sentences'
import {
  insertSentenceIntoDb,
  findDomainIdByNameInDb,
} from '../../repository/sentences-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import {
  either as E,
  task as T,
  taskEither as TE,
  taskOption as TO,
} from 'fp-ts'
import { ApplicationError, OtherErrorKind } from '../../../types/error'
import {
  createError,
  createSentenceValidationError,
} from '../../../helper/error-helper'
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
    TE.bind('domainIds', () => {
      const domains = command.domains ?? []
      const findDomainIds = domains.map(domain =>
        findDomainIdByNameInDb(domain)
      )
      return pipe(
        findDomainIds,
        TO.sequenceArray,
        TE.fromTaskOption(() =>
          createError(OtherErrorKind)(
            `Could not find a matching domain in ${command.domains}`
          )
        )
      )
    }),
    TE.map(({ sentenceSubmission, domainIds }): SentenceSubmission => {
      return {
        ...sentenceSubmission,
        domain_ids: [...domainIds],
      }
    }),
    TE.chain(sentenceSubmission => insertSentenceIntoDb(sentenceSubmission))
  )
}
