import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { AddMultipleSentencesCommandHandler } from './add-multiple-sentences-command-handler'
import { AddMultipleSentencesCommand } from './command/add-multiple-sentences-command'

describe('AddMultipleSentencesCommandHandler', () => {
  const mockFindDomainIdByName = jest.fn()
  const mockFindVariantByTag = jest.fn()
  const mockFindLocaleByName = jest.fn()
  const mockInsertBulkSentences = jest.fn()

  const handler = AddMultipleSentencesCommandHandler(mockFindDomainIdByName)(
    mockFindVariantByTag
  )(mockFindLocaleByName)(mockInsertBulkSentences)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should successfully add multiple sentences', async () => {
    const command: AddMultipleSentencesCommand = {
      rawSentenceInput: 'Sentence one.\nSentence two.',
      localeName: 'en',
      domains: ['general'],
      variant: O.some('standard'),
      clientId: 'test-client',
      source: 'user',
    }

    mockFindLocaleByName.mockReturnValue(TE.right(O.some({ id: 1 })))
    mockFindDomainIdByName.mockReturnValue(TE.right(O.some([1])))
    mockFindVariantByTag.mockReturnValue(TE.right(O.some({ id: 1 })))
    mockInsertBulkSentences.mockReturnValue(TE.right(undefined))

    const result = await handler(command)()

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toHaveLength(0) // Assuming all sentences are valid
    }

    expect(mockFindLocaleByName).toHaveBeenCalledWith('en')
    expect(mockFindDomainIdByName).toHaveBeenCalledWith('general')
    expect(mockFindVariantByTag).toHaveBeenCalledWith('standard')
    expect(mockInsertBulkSentences).toHaveBeenCalled()
  })

  it('should return validation errors for invalid sentences', async () => {
    const command: AddMultipleSentencesCommand = {
      rawSentenceInput: 'Invalid sentence 1!\nAnother invalid sentence 2?',
      localeName: 'en',
      domains: ['general'],
      variant: O.none,
      clientId: 'test-client',
      source: 'user',
    }

    mockFindLocaleByName.mockReturnValue(TE.right(O.some({ id: 1 })))
    mockFindDomainIdByName.mockReturnValue(TE.right(O.some(1)))
    mockInsertBulkSentences.mockReturnValue(TE.right(undefined))

    const result = await handler(command)()

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toHaveLength(2) // Both sentences should have errors
      expect(result.right[0].errorType).toBeDefined()
      expect(result.right[1].errorType).toBeDefined()
    }
  })

  it('should handle locale not found error', async () => {
    const command: AddMultipleSentencesCommand = {
      rawSentenceInput: 'Test sentence.',
      localeName: 'invalid-locale',
      domains: [],
      variant: O.none,
      clientId: 'test-client',
      source: 'user',
    }

    mockFindLocaleByName.mockReturnValue(TE.right(O.none))

    const result = await handler(command)()

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toContain('Locale not found')
    }
  })

  it('should handle database error', async () => {
    const command: AddMultipleSentencesCommand = {
      rawSentenceInput: 'Test sentence.',
      localeName: 'en-US',
      domains: [],
      variant: O.none,
      clientId: 'test-client',
      source: 'user',
    }

    mockFindLocaleByName.mockReturnValue(TE.right(O.some({ id: 1 })))
    mockInsertBulkSentences.mockReturnValue(
      TE.left(new Error('Database error'))
    )

    const result = await handler(command)()

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toContain(
        'Error inserting small sentence batch'
      )
    }
  })
})
