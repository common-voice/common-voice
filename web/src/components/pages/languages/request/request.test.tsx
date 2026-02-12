import * as React from 'react'
import * as ReactRouterDom from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { act, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '../../../../../test/render-with-providers'

expect.extend(toHaveNoViolations)

import LanguagesRequestFormPage from './request'

jest.mock('../../../../logger')

// mock window.scrollTo
global.scrollTo = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseHistoryPush = jest.fn(() => null as any)
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof ReactRouterDom),
  useHistory: () => ({
    push: mockUseHistoryPush,
  }),
}))

const mockSendLanguageRequest = jest.fn(() => Promise.resolve())
jest.mock('../../../../hooks/store-hooks', () => ({
  useAPI: () => ({
    sendLanguageRequest: mockSendLanguageRequest,
  }),
}))

async function fillInForm({
  getByRole,
  getByTestId,
}: {
  getByRole: any // eslint-disable-line @typescript-eslint/no-explicit-any
  getByTestId?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  // Simulate entering a non-existing locale to make form fields available
  userEvent.type(getByTestId('language-search-input'), 'xyz')

  // fill in main form
  userEvent.type(
    getByTestId('request-language-form-email'),
    'billgates@example.com'
  )

  if (getByTestId) {
    userEvent.click(getByTestId('request-for-scripted-speech-toggle'))
  }

  userEvent.type(
    getByTestId('request-language-form-info'),
    'The language is JavaScript lol!'
  )
  userEvent.click(
    getByTestId('request-language-privacy-checkbox')
  )

  // submit
  await act(async () => {
    await userEvent.click(getByRole('button', { name: 'Submit' }))
  })
}

describe('LanguagesRequestFormPage', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render with no accessibility violations', async () => {
    let renderResult: RenderResult
    act(() => {
      renderResult = renderWithProviders(<LanguagesRequestFormPage />)
    })
    const results = await axe(renderResult.container)
    expect(results).toHaveNoViolations()
  })

  it('submits valid data', async () => {
    let renderResult: RenderResult
    act(() => {
      renderResult = renderWithProviders(<LanguagesRequestFormPage />)
    })
    const { getByRole, getByTestId } = renderResult

    await fillInForm({
      getByRole,
      getByTestId,
    })

    // correctly sends email request to server
    await expect(mockSendLanguageRequest).toBeCalledWith({
      email: 'billgates@example.com',
      languageInfo: 'The language is JavaScript lol!',
      languageLocale: 'en-US',
      platforms: ['scripted-speech'],
    })

    // redirects to success page
    await expect(mockUseHistoryPush).toBeCalledWith(
      '/en/language/request/success'
    )
  })

  it('disables the submit button if no toggle option is selected', async () => {
    let renderResult: RenderResult
    act(() => {
      renderResult = renderWithProviders(<LanguagesRequestFormPage />)
    })

    const { getByTestId } = renderResult
    // First make the form visible by entering a search query
    userEvent.type(getByTestId('language-search-input'), 'xyz')
    // button should be disabled before the toggles are selected
    expect(getByTestId('request-language-btn').hasAttribute('disabled'))
  })

  it('shows error if server endpoint errors', async () => {
    mockSendLanguageRequest.mockImplementation(
      jest.fn(() => Promise.reject(new Error('Something Went Wrong')))
    )

    let renderResult: RenderResult
    act(() => {
      renderResult = renderWithProviders(<LanguagesRequestFormPage />)
    })
    const { getByRole, getByTestId } = renderResult

    await fillInForm({
      getByRole,
      getByTestId,
    })

    // no redirect
    await expect(mockUseHistoryPush).not.toBeCalled()

    // showing error message instead
    expect(getByTestId('request-language-error')).toBeTruthy()
  })
})
