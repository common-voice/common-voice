import { either as E, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { AddSentenceCommandHandler } from '../../../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import { ERR_TOO_LONG, ValidateSentence } from '../../../../../core/sentences'
import {
  FindDomainIdByName,
  SaveSentence,
} from '../../../../../application/repository/sentences-repository'
import { AddSentenceCommand } from '../../../../../application/sentences/use-case/command-handler/command/add-sentence-command'
import { SentenceSubmission } from '../../../../../application/types/sentence-submission'
import { FindVariantByTag } from '../../../../../application/repository/variant-repository'
import { FindLocaleByName } from '../../../../../application/repository/locale-repository'

describe('Add sentence command handler', () => {
  it('should save the sentence in the repository', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('This is a sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTokenMock: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', tag: 'ca-central', locale: 'ca' })
      )
    )
    const findLocaleByNameMock: FindLocaleByName = jest.fn(() =>
      TE.right(
        O.some({
          id: 27,
          name: 'ca',
          targetSentenceCount: 0,
          isContributable: true,
          isTranslated: true,
          textDirection: 'LTR',
        })
      )
    )

    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeName: 'en',
      source: 'Myself',
      domains: ['finance'],
      variant: O.none,
    }

    const expectedSentenceSubmission: SentenceSubmission = {
      sentence: 'This is a sentence',
      source: 'Myself',
      locale_id: 27,
      client_id: 'abc',
      domain_ids: O.some([1]),
      variant_id: O.none,
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantByTokenMock),
      I.ap(findLocaleByNameMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    expect(saveSentenceMock).toBeCalledWith(expectedSentenceSubmission)
    expect(E.isRight(result)).toBeTruthy()
  })

  it('should return validation error', async () => {
    const validationError = {
      error: 'Oops',
      errorType: ERR_TOO_LONG,
    }
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.left(validationError)
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTokenMock: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', tag: 'ca-central', locale: 'ca' })
      )
    )
    const findLocaleByNameMock: FindLocaleByName = jest.fn(() =>
      TE.right(
        O.some({
          id: 27,
          name: 'ca',
          targetSentenceCount: 0,
          isContributable: true,
          isTranslated: true,
          textDirection: 'LTR',
        })
      )
    )
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeName: 'en',
      source: 'Myself',
      domains: ['finance'],
      variant: O.none,
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantByTokenMock),
      I.ap(findLocaleByNameMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    expect(E.isLeft(result)).toBeTruthy()
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })

  it('should return validation error when locale does not match variant', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('This is a sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTokenMock: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', tag: 'ca-central', locale: 'ca' })
      )
    )
    const findLocaleByNameMock: FindLocaleByName = jest.fn(() =>
      TE.right(
        O.some({
          id: 27,
          name: 'ca',
          targetSentenceCount: 0,
          isContributable: true,
          isTranslated: true,
          textDirection: 'LTR',
        })
      )
    )
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeName: 'en',
      source: 'Myself',
      domains: ['finance'],
      variant: O.some('ca-central'),
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantByTokenMock),
      I.ap(findLocaleByNameMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    const errMsg = pipe(
      result,
      E.match(
        err => err.message,
        () => 'should not happen'
      )
    )

    expect(E.isLeft(result)).toBeTruthy()
    expect(errMsg).toBe('Locale does not match variant')
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })

  it('should return validation error when locale is not found', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('This is a sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTokenMock: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', tag: 'ca-central', locale: 'ca' })
      )
    )
    const findLocaleByNameMock: FindLocaleByName = jest.fn(() =>
      TE.right(O.none)
    )
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeName: 'ca',
      source: 'Myself',
      domains: ['finance'],
      variant: O.some('ca-central'),
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantByTokenMock),
      I.ap(findLocaleByNameMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    const errMsg = pipe(
      result,
      E.match(
        err => err.message,
        () => 'should not happen'
      )
    )

    expect(E.isLeft(result)).toBeTruthy()
    expect(errMsg).toBe('Locale not found')
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })
})
