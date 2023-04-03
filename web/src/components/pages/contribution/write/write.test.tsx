import * as React from 'react'
import { renderWithProviders } from '../../../../../test/render-with-providers'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import Write from './write'

const useActionMock = jest.fn()

jest.mock('../../../../hooks/store-hooks', () => ({
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

jest.mock('../../../locale-helpers', () => ({
  useLocale: () => {
    const mockLocale = 'mock-locale-1'
    return [mockLocale]
  },
  LocaleLink: () => <div>Mock locale Link</div>,
}))

afterEach(() => {
  jest.clearAllMocks()
})

// TODO: At the moment we can't test validation errors like creating a sentence with numbers
// we should write tests for this in e2e tests

describe('Write page', () => {
  it('renders Write page', () => {
    renderWithProviders(<Write />)

    expect(screen.getByTestId('write-page')).toBeTruthy()
    // assert that submit button is disabled
    expect(screen.getByTestId('submit-button').hasAttribute('disabled'))
  })

  it('requires a citation before submitting', () => {
    renderWithProviders(<Write />)

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
    renderWithProviders(<Write />)

    const sentenceTextArea = screen.getByTestId('sentence-textarea')
    const citationInput = screen.getByTestId('citation-input')
    const checkBox = screen.getByTestId('public-domain-checkbox')
    const submitButton = screen.getByTestId('submit-button')

    fireEvent.change(sentenceTextArea, {
      target: { value: 'This is a mock sentence' },
    })
    fireEvent.change(citationInput, { target: { value: 'me' } })

    fireEvent.click(checkBox)

    fireEvent.click(submitButton)

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        sentence: 'This is a mock sentence',
        source: 'me',
        localeId: 1,
        localeName: 'mock-locale-1',
      })
    })
  })
})
