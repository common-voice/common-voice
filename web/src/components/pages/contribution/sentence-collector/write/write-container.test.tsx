import * as React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../test/render-with-providers'
import WriteContainer from './write-container'
import * as storeHooksModule from '../../../../../hooks/store-hooks'

import { SmallBatchResponse } from './sentence-write/types'

const useActionMock = jest.fn()
const mockVariants = jest.fn(() => Promise.resolve({}))

jest.mock('../../../../../hooks/store-hooks', () => ({
  useLanguages: () => {
    return {
      localeNameAndIDMapping: [
        { id: 1, name: 'mock-locale-1' },
        { id: 2, name: 'mock-locale-2' },
        { id: 3, name: 'mock-locale-3' },
      ],
    }
  },
  useAction: () => useActionMock,
  useAccount: () => ({}),
  useSentences: () => ({
    'mock-locale-1': {
      bulkUploadStatus: 'off',
    },
  }),
  useAPI: () => {
    return {
      getVariants: mockVariants,
    }
  },
}))

jest.mock('../../../../locale-helpers', () => ({
  useLocale: () => {
    const mockLocale = 'mock-locale-1'
    return [mockLocale]
  },
  LocaleLink: () => <div>Mock locale Link</div>,
  LocaleNavLink: () => <div>Mock locale Nav Link</div>,
}))

afterEach(() => {
  jest.clearAllMocks()
})

const submitSentence = (sentence: string) => {
  const sentenceTextArea = screen.getByTestId('sentence-textarea')
  const citationInput = screen.getByTestId('citation-input')
  const submitButton = screen.getByTestId('submit-button')
  const publicDomainCheckBox = screen.getByTestId('public-domain-checkbox')

  fireEvent.change(sentenceTextArea, {
    target: {
      value: sentence,
    },
  })

  fireEvent.change(citationInput, { target: { value: 'self' } })

  fireEvent.click(publicDomainCheckBox)

  fireEvent.click(submitButton)
}

describe('Write container', () => {
  it('renders the write container', async () => {
    renderWithProviders(<WriteContainer />)

    await waitFor(() => {
      expect(screen.getByTestId('single-submission-form')).toBeTruthy()
      expect(screen.getByTestId('sc-toggle')).toBeTruthy()
    })
  })

  it('toggles the active write option', async () => {
    renderWithProviders(<WriteContainer />)

    // The single write option is rendered by default so we want to toggle to the bulk option
    const bulkToggleOption = screen.getByTestId('bulk-option')

    fireEvent.click(bulkToggleOption)

    await waitFor(async () => {
      expect(screen.getByTestId('bulk-upload-container')).toBeTruthy()
    })
  })

  it('submits small batch sentences', async () => {
    const mockResponse = {
      valid_sentences_count: 5,
      total_count: 5,
      invalid_sentences: [],
    } as unknown as SmallBatchResponse

    const mockCreateSentence = jest.fn().mockResolvedValue(mockResponse)

    useActionMock.mockResolvedValue(mockCreateSentence())

    renderWithProviders(<WriteContainer />)

    const smallBatchOption = screen.getByTestId('small-batch-option')
    fireEvent.click(smallBatchOption)

    submitSentence('This is a mock sentence\nThis is the second mock sentence')

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        sentenceSubmission: {
          domains: [],
          sentence: 'This is a mock sentence\nThis is the second mock sentence',
          source: 'self',
          localeName: 'mock-locale-1',
        },
        isSmallBatch: true,
      })
    })
  })

  it('hides the toggle option if the account is null', () => {
    jest
      .spyOn(storeHooksModule, 'useAccount')
      .mockImplementationOnce(() => null)

    renderWithProviders(<WriteContainer />)

    waitFor(() => expect(screen.findByTestId('sc-toggle')).not.toBeTruthy())
  })
})
