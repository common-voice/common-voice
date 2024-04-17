import { either as E, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { AddSentenceCommandHandler } from '../../../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import { ERR_TOO_LONG, ValidateSentence } from '../../../../../core/sentences'
import {
  FindDomainIdByName,
  SaveSentence,
} from '../../../../../application/sentences/repository/sentences-repository'
import { AddSentenceCommand } from '../../../../../application/sentences/use-case/command-handler/command/add-sentence-command'
import { SentenceSubmission } from '../../../../../application/types/sentence-submission'
import { FindVariantByTag } from '../../../../../application/sentences/repository/variant-repository'
import { GetAllLocales } from '../../../../../application/sentences/repository/locale-repository'

describe('Add sentence command handler', () => {
  it('should save the sentence in the repository', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('This is a sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTag: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', locale: 'ca', tag: 'ca-central' })
      )
    )
    const getAllLocales: GetAllLocales = jest.fn(() => TE.right([{ id: 2, name: 'ca' }]))
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeName: 'ca',
      source: 'Myself',
      domains: ['finance'],
      variant: O.some('ca-central'),
    }

    const expectedSentenceSubmission: SentenceSubmission = {
      sentence: 'This is a sentence',
      source: 'Myself',
      locale_id: 2,
      client_id: 'abc',
      domain_ids: [1],
      variant: O.some({
        id: 1,
        name: 'Central',
        locale: 'ca',
        tag: 'ca-central',
      }),
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantByTag),
      I.ap(getAllLocales),
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
    const findVariantByTag: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', locale: 'ca', tag: 'ca-central' })
      )
    )
    const getAllLocales: GetAllLocales = jest.fn(() => TE.right([{ id: 1, name: 'ca' }]))
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
      I.ap(findVariantByTag),
      I.ap(getAllLocales),
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
    const findVariantByTag: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', locale: 'ca', tag: 'ca-central' })
      )
    )
    const getAllLocales: GetAllLocales = jest.fn(() => TE.right([{ id: 1, name: 'ca' }]))
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
      I.ap(findVariantByTag),
      I.ap(getAllLocales),
      I.ap(saveSentenceMock)
    )
    const result = await pipe(cmd, cmdHandler)()
    const errMsg = pipe(
      result,
      E.fold(
        err => err.message,
        () => "Shouldn't be here"
      )
    )

    expect(E.isLeft(result)).toBeTruthy()
    expect(errMsg).toBe('Sentence variant does not match locale')
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })

  it('should return error when locale is not found', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('This is a sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantByTag: FindVariantByTag = jest.fn(() =>
      TE.right(
        O.some({ id: 1, name: 'Central', locale: 'ca', tag: 'ca-central' })
      )
    )
    const getAllLocales: GetAllLocales = jest.fn(() => TE.right([{ id: 1, name: 'en' }]))
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
      I.ap(findVariantByTag),
      I.ap(getAllLocales),
      I.ap(saveSentenceMock)
    )
    const result = await pipe(cmd, cmdHandler)()
    const errMsg = pipe(
      result,
      E.fold(
        err => err.message,
        () => "Shouldn't be here"
      )
    )

    expect(E.isLeft(result)).toBeTruthy()
    expect(errMsg).toBe('Locale not found')
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })
})
