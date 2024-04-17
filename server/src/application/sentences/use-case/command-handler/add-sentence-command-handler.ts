import * as O from 'fp-ts/Option'
import * as Id from 'fp-ts/Identity'
import * as A from 'fp-ts/Array'
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
import {
  GetAllLocales,
  Locale,
  getAllLocales,
} from '../../repository/locale-repository'
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

const validateVariantWithLocale =
  (localeName: string) => (variant: Variant) => {
    return variant.locale === localeName
  }

export const AddSentenceCommandHandler =
  (validateSentence: ValidateSentence) =>
    (findDomainIdByName: FindDomainIdByName) =>
      (findVariantByTag: FindVariantByTag) =>
        (getAllLocales: GetAllLocales) =>
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
                    O.match(() => TE.of(O.none), findVariantByTag)
                  )
                ),
                TE.bind('isLocaleMatching', ({ variant }) => {
                  const doesNotMatchErr = createValidationError(
                    'Sentence variant does not match locale'
                  )

                  return pipe(
                    variant,
                    O.map(validateVariantWithLocale(command.localeName)),
                    O.map(res => (res ? TE.right(true) : TE.left(doesNotMatchErr))),
                    O.getOrElse(() => TE.left(doesNotMatchErr))
                  )
                }),
                TE.bind('localeId', () =>
                  pipe(
                    getAllLocales(),
                    TE.chain(locales =>
                      pipe(
                        locales,
                        A.findFirst(locale => locale.name === command.localeName),
                        O.map(({ id }) => id),
                        TE.fromOption(() =>
                          createValidationError('Locale not found')
                        )
                      )
                    )
                  )
                ),
                TE.map(
                  ({
                    validatedSentence,
                    localeId,
                    domainIds,
                    variant,
                  }): SentenceSubmission => {
                    return {
                      sentence: validatedSentence,
                      source: command.source,
                      locale_id: localeId,
                      client_id: command.clientId,
                      domain_ids: [...domainIds],
                      variant: variant,
                    }
                  }
                ),
                TE.chain(saveSentence)
              )
