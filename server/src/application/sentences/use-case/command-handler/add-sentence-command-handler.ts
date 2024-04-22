import * as O from 'fp-ts/Option'
import * as Id from 'fp-ts/Identity'
import { pipe } from 'fp-ts/lib/function'
import { ValidateSentence, ValidatedSentence } from '../../../../core/sentences'
import {
  FindDomainIdByName,
  SaveSentence,
} from '../../repository/sentences-repository'
import { AddSentenceCommand } from './command/add-sentence-command'
import { either as E, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../../types/error'
import {
  createSentenceValidationError,
  createValidationError,
} from '../../../helper/error-helper'
import { SentenceSubmission } from '../../../types/sentence-submission'
import { FindVariantByTag } from '../../repository/variant-repository'
import { Variant } from '../../../../core/types/variant'

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

const doesLocaleMatchVariant =
  (locale: string) =>
  (variant: Variant): boolean =>
    variant.locale === locale

export const AddSentenceCommandHandler =
  (validateSentence: ValidateSentence) =>
  (findDomainIdByName: FindDomainIdByName) =>
  (findVariantByToken: FindVariantByTag) =>
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
      TE.bind('variant', () =>
        pipe(
          command.variant,
          O.match(
            () => TE.right(O.none),
            variant => findVariantByToken(variant)
          )
        )
      ),
      TE.bind('doesLocaleMatchVariant', ({ variant }) =>
        pipe(
          variant,
          O.map(doesLocaleMatchVariant(command.localeName)),
          O.match(
            () => TE.right(true),
            isMatching =>
              isMatching
                ? TE.right(true)
                : TE.left(
                    createValidationError('Locale does not match variant')
                  )
          )
        )
      ),
      TE.map(
        ({ validatedSentence, domainIds, variant }): SentenceSubmission => {
          const variantId = pipe(
            variant,
            O.map(variant => variant.id)
          )

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
      TE.chain(saveSentence)
    )
