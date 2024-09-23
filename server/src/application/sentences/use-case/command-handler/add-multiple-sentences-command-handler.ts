import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import {
  ValidatorRuleError,
  ValidatorRuleErrorType,
  validateSentence,
} from '../../../../core/sentences'
import { cleanRawMultipleSentencesInput } from '../../../../core/sentences/cleaning/multiple-sentences'
import {
  createDatabaseError,
  createValidationError,
} from '../../../helper/error-helper'
import { FindLocaleByName } from '../../../repository/locale-repository'
import {
  FindDomainIdByName,
  InsertBulkSentences,
} from '../../../repository/sentences-repository'
import { FindVariantByTag } from '../../../repository/variant-repository'
import { ApplicationError } from '../../../types/error'
import { SentenceSubmission } from '../../../types/sentence-submission'
import { toDomainIds } from '../../helper/domain-helper'
import { AddMultipleSentencesCommand } from './command/add-multiple-sentences-command'

export const AddMultipleSentencesCommandHandler =
  (findDomainIdByName: FindDomainIdByName) =>
  (findVariantByTag: FindVariantByTag) =>
  (findLocaleByName: FindLocaleByName) =>
  (insertBulkSentences: InsertBulkSentences) =>
  (
    cmd: AddMultipleSentencesCommand
  ): TE.TaskEither<ApplicationError, SentenceWithError[]> =>
    pipe(
      TE.Do,
      TE.let('cleanedSentences', () =>
        cleanRawMultipleSentencesInput(cmd.rawSentenceInput)
      ),
      TE.let('validatedSentences', ({ cleanedSentences }) =>
        validateSentences(cmd.localeName)(cleanedSentences)
      ),
      TE.bind('localeId', () =>
        pipe(
          findLocaleByName(cmd.localeName),
          TE.chain(locale =>
            pipe(
              locale,
              O.match(
                () => TE.left(createValidationError('Locale not found')),
                locale => TE.right(locale.id)
              )
            )
          )
        )
      ),
      TE.bind('domainIds', () => toDomainIds(findDomainIdByName)(cmd.domains)),
      TE.bind('variant', () =>
        pipe(
          cmd.variant,
          O.match(
            () => TE.right(O.none),
            variant => findVariantByTag(variant)
          )
        )
      ),
      TE.chainFirst(({ localeId, variant, domainIds, validatedSentences }) => {
        const sentences = validatedSentences.left
        const variant_id = pipe(
          variant,
          O.map(v => v.id)
        )
        const sentenceSubmissions: SentenceSubmission[] = pipe(
          sentences,
          A.map(sentence => {
            return {
              ...sentence,
              locale_id: localeId,
              client_id: cmd.clientId,
              source: cmd.source,
              variant_id,
              domain_ids: O.some(domainIds),
            }
          })
        )
        return pipe(
          insertBulkSentences(sentenceSubmissions, {
            isUsed: false,
            isValidated: false,
          }),
          TE.mapLeft(e =>
            createDatabaseError('Error inserting small sentence batch', e)
          )
        )
      }),
      TE.map(({ validatedSentences }) => validatedSentences.right)
    )

const validateSentences =
  (locale: string) =>
  (
    sentences: string[]
  ): { left: ValidatedSentence[]; right: SentenceWithError[] } =>
    pipe(
      sentences,
      A.map(sentence =>
        pipe(
          sentence,
          validateSentence(locale),
          E.match(
            err => ({ sentence: sentence, errorType: err.errorType }),
            () => ({ sentence: sentence })
          )
        )
      ),
      A.partition(isSentenceWithError)
    )

const isSentenceWithError = (
  sentence: SentenceValidationResult
): sentence is SentenceWithError => 'errorType' in sentence

type SentenceValidationResult = ValidatedSentence | SentenceWithError

type Sentence = {
  sentence: string
}

type ValidatedSentence = Sentence

type SentenceWithError = Sentence & {
  errorType: ValidatorRuleErrorType
}
