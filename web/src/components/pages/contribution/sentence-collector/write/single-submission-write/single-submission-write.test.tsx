import * as React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../../test/render-with-providers'

import SingleSubmissionWrite from './single-submission-write'

const useActionMock = jest.fn()

const mockVariants = jest.fn(() => Promise.resolve({}))

const allVariants = ['mock-variant-1', 'mock-variant-2']

jest.mock('../../../../../../hooks/store-hooks', () => ({
  useAction: () => useActionMock,
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
    renderWithProviders(<SingleSubmissionWrite allVariants={allVariants} />)

    await waitFor(() => {
      expect(screen.getByTestId('single-submission-form')).toBeTruthy()
      // assert that submit button is disabled
      expect(screen.getByTestId('submit-button').hasAttribute('disabled'))
    })
  })

  it('requires a citation before submitting', async () => {
    renderWithProviders(<SingleSubmissionWrite allVariants={allVariants} />)

    const sentenceTextArea = screen.getByTestId('sentence-textarea')
    const checkBox = screen.getByTestId('public-domain-checkbox')
    const submitButton = screen.getByTestId('submit-button')

    await waitFor(() => {
      fireEvent.change(sentenceTextArea, {
        target: { value: 'This is a mock sentence' },
      })

      fireEvent.click(checkBox)

      // assert that submit button is not disabled
      expect(
        screen.getByTestId('submit-button').hasAttribute('disabled')
      ).toBeFalsy()

      fireEvent.click(submitButton)

      expect(screen.getByTestId('citation-error-message')).toBeTruthy()
    })
  })

  it('submits when all fields are filled', async () => {
    renderWithProviders(<SingleSubmissionWrite allVariants={allVariants} />)

    const sentenceTextArea = screen.getByTestId('sentence-textarea')
    const citationInput = screen.getByTestId('citation-input')
    const checkBox = screen.getByTestId('public-domain-checkbox')
    const submitButton = screen.getByTestId('submit-button')
    const sentenceDomainDropdown = screen.getByTestId(
      'multiple-combobox-dropdown'
    )

    fireEvent.change(sentenceTextArea, {
      target: { value: 'This is a mock sentence' },
    })

    fireEvent.click(sentenceDomainDropdown)

    // select general domain
    fireEvent.click(screen.getByTestId('general'))

    fireEvent.change(citationInput, { target: { value: 'self' } })

    fireEvent.click(checkBox)

    fireEvent.click(submitButton)

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        domains: ['general'],
        sentence: 'This is a mock sentence',
        source: 'self',
        localeName: 'mock-locale-1',
      })
    })
  })
})
