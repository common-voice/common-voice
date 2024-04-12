import { either as E, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { AddSentenceCommandHandler } from '../../../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import {
  ERR_TOO_LONG,
  ValidateSentence,
} from '../../../../../core/sentences'
import {
  FindDomainIdByName,
  FindVariantIdByToken,
  SaveSentence,
} from '../../../../../application/sentences/repository/sentences-repository'
import { AddSentenceCommand } from '../../../../../application/sentences/use-case/command-handler/command/add-sentence-command'

describe('Add sentence command handler', () => {
  it('should save the sentence in the repository', async () => {
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.right('Correct Sentence')
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantIdByTokenMock: FindVariantIdByToken = jest.fn(() =>
      TE.right(O.some(1))
    )
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeId: 1,
      localeName: 'en',
      source: 'Myself',
      domains: ['finance'],
      variant: O.none,
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantIdByTokenMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    expect(E.isRight(result)).toBeTruthy()
  })

  it('should return validation error', async () => {
    const validationError = {
      error: 'Oops',
      errorType: ERR_TOO_LONG
    }
    const validateSentenceMock: ValidateSentence = jest.fn(
      () => () => E.left(validationError)
    )
    const findDomainIdByNameMock: FindDomainIdByName = jest.fn(() =>
      TE.right(O.some(1))
    )
    const findVariantIdByTokenMock: FindVariantIdByToken = jest.fn(() =>
      TE.right(O.some(1))
    )
    const saveSentenceMock: SaveSentence = jest.fn(() => TE.right(constVoid()))

    const cmd: AddSentenceCommand = {
      clientId: 'abc',
      sentence: 'This is a sentence',
      localeId: 1,
      localeName: 'en',
      source: 'Myself',
      domains: ['finance'],
      variant: O.none,
    }

    const cmdHandler = pipe(
      AddSentenceCommandHandler,
      I.ap(validateSentenceMock),
      I.ap(findDomainIdByNameMock),
      I.ap(findVariantIdByTokenMock),
      I.ap(saveSentenceMock)
    )

    const result = await pipe(cmd, cmdHandler)()
    expect(E.isLeft(result)).toBeTruthy()
    expect(saveSentenceMock).toHaveBeenCalledTimes(0)
  })
})
