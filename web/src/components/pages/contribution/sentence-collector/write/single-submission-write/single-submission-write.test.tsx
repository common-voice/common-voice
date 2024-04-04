import * as React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '../../../../../../../test/render-with-providers'

import SingleSubmissionWrite from './single-submission-write'

const useActionMock = jest.fn()

jest.mock('../../../../../../hooks/store-hooks', () => ({
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
  it('renders Single Submission Write page', () => {
    renderWithProviders(<SingleSubmissionWrite />)

    expect(screen.getByTestId('single-submission-form')).toBeTruthy()
    // assert that submit button is disabled
    expect(screen.getByTestId('submit-button').hasAttribute('disabled'))
  })

  it('requires a citation before submitting', () => {
    renderWithProviders(<SingleSubmissionWrite />)

    const sentenceTextArea = screen.getByTestId('sentence-textarea')
    const checkBox = screen.getByTestId('public-domain-checkbox')
    const submitButton = screen.getByTestId('submit-button')

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

  it('submits when all fields are filled', async () => {
    renderWithProviders(<SingleSubmissionWrite />)

    const sentenceTextArea = screen.getByTestId('sentence-textarea')
    const citationInput = screen.getByTestId('citation-input')
    const checkBox = screen.getByTestId('public-domain-checkbox')
    const submitButton = screen.getByTestId('submit-button')
    const sentenceDomainDropdown = screen.getByTestId('sentence-domain-select')

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
        localeId: 1,
        localeName: 'mock-locale-1',
      })
    })
  })
})
