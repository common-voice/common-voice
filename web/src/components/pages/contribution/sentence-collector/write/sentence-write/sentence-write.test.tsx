import * as React from 'react'
import { screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../../test/render-with-providers'

import { SentenceWrite } from '.'

const useActionMock = jest.fn()

const mockVariants = jest.fn(() => Promise.resolve({}))
const mockHandlesSubmit = jest.fn().mockImplementation(e => e.preventDefault())

const allVariants = ['mock-variant-1', 'mock-variant-2']
const mockCitation = 'mock-citation'
const mockSentence = 'Mock sentence'
const mockSentenceVariant = 'mock-variant-1'
const mockSentenceDomains = ['mock-domain-1', 'mock-domain-2']

jest.mock('../../../../../../hooks/store-hooks', () => ({
  useAction: () => useActionMock,
  useAccount: () => ({}),
  useAPI: () => {
    return {
      getVariants: mockVariants,
    }
  },
}))

jest.mock('../../../../../locale-helpers', () => ({
  useLocale: () => {
    const mockLocale = 'mock-locale-1'
    return [mockLocale]
  },
  LocaleLink: () => <div>Mock locale Link</div>,
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('Single Submission Write page', () => {
  it('renders Single Submission Write page', async () => {
    renderWithProviders(
      <SentenceWrite
        allVariants={allVariants}
        mode="single"
        handleCitationChange={jest.fn()}
        handlePublicDomainChange={jest.fn()}
        handleSentenceDomainChange={jest.fn()}
        handleSentenceInputChange={jest.fn()}
        handleSentenceVariantChange={jest.fn()}
        handleSubmit={mockHandlesSubmit}
        citation={mockCitation}
        sentence={mockSentence}
        sentenceVariant={mockSentenceVariant}
        sentenceDomains={mockSentenceDomains}
        confirmPublicDomain
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('single-submission-form')).toBeTruthy()
      // assert that submit button is disabled
      expect(screen.getByTestId('submit-button').hasAttribute('disabled'))
    })
  })
})
