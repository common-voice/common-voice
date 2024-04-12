import * as O from 'fp-ts/Option'
import * as Id from 'fp-ts/Identity'
import { pipe } from 'fp-ts/lib/function'
import { ValidateSentence, ValidatedSentence } from '../../../../core/sentences'
import {
  FindDomainIdByName,
  FindVariantIdByToken,
  SaveSentence,
} from '../../repository/sentences-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import { either as E, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import { createSentenceValidationError } from '../../../helper/error-helper'
import { SentenceSubmission } from '../../../types/sentence-submission'

const toValidatedSentence =
  (validateSentence: ValidateSentence) =>
  (sentence: string) =>
  (localeName: string): TE.TaskEither<ApplicationError, ValidatedSentence> =>
    pipe(
      sentence,
      validateSentence(localeName),
      E.mapLeft(createSentenceValidationError),
      TE.fromEither
    )

const toDomainIds =
  (findDomainId: FindDomainIdByName) =>
  (domains: string[]): TE.TaskEither<ApplicationError, number[]> => {
    const findDomainIds = domains.map(domain => findDomainId(domain))
    return pipe(
      findDomainIds,
      TE.sequenceArray,
      TE.map(domainIds => pipe(domainIds, O.sequenceArray)),
      TE.map(domainIds =>
        pipe(
          domainIds,
          O.getOrElse(() => [])
        )
      )
    )
  }

export const AddSentenceCommandHandler =
  (validateSentence: ValidateSentence) =>
  (findDomainIdByName: FindDomainIdByName) =>
  (findVariantIdByToken: FindVariantIdByToken) =>
  (saveSentence: SaveSentence) =>
  (command: AddSentenceCommand): TE.TaskEither<ApplicationError, void> =>
    pipe(
      TE.Do,
      TE.bind('validatedSentence', () =>
        pipe(
          toValidatedSentence,
          Id.ap(validateSentence),
          Id.ap(command.sentence),
          Id.ap(command.localeName)
        )
      ),
      TE.bind('domainIds', () =>
        toDomainIds(findDomainIdByName)(command.domains)
      ),
      TE.bind('variantId', () =>
        pipe(
          command.variant,
          O.match(() => TE.of(O.none), findVariantIdByToken)
        )
      ),
      TE.map(
        ({ validatedSentence, domainIds, variantId }): SentenceSubmission => {
          return {
            sentence: validatedSentence,
            source: command.source,
            locale_id: command.localeId,
            client_id: command.clientId,
            domain_ids: [...domainIds],
            variant_id: variantId,
          }
        }
      ),
      TE.chain(sentenceSubmission => saveSentence(sentenceSubmission))
    )
