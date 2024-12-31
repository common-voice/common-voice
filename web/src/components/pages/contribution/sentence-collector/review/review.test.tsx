import * as React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import Review from './review'
import { renderWithProviders } from '../../../../../../test/render-with-providers'
import * as storeHooks from '../../../../../hooks/store-hooks'
import { mockPendingSentences } from './review.mocks'

const useActionMock = jest.fn()

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
  useAccount: () => {
    return {
      languages: [
        {
          locale: 'mock-locale-1',
          variant: {
            id: 1,
            name: 'mock-variant-name',
            token: 'mock-variant-token',
            is_preferred_option: false,
          },
        },
        { locale: 'mock-locale-2' },
      ],
    }
  },
  useSentences: () => ({
    'mock-locale-1': {},
  }),
}))

jest.mock('../../../../locale-helpers', () => ({
  useLocale: () => {
    const mockLocale = 'mock-locale-1'
    return [mockLocale]
  },
  LocaleLink: () => <div>Mock locale Link</div>,
}))

beforeAll(() => {
  delete global.window.location
  global.window = Object.create(window)
  global.window.location = {
    ancestorOrigins: null,
    hash: null,
    host: 'dummyurl.com',
    port: '80',
    protocol: 'http:',
    hostname: 'dummy.com',
    href: 'http://dummyurl.com',
    origin: 'http://dummyurl.com',
    pathname: '/mock/path',
    search: null,
    assign: null,
    reload: null,
    replace: null,
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Review page', () => {
  it('renders Review page', () => {
    renderWithProviders(<Review />)

    // it should render empty state because we don't have any sentence
    expect(screen.getByTestId('review-empty-state')).toBeTruthy()
  })

  it('renders sentences for review', () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)
    const activeReviewCard = screen.getByTestId('active-review-card')
    const reviewCards = screen.getAllByTestId('review-card')

    expect(activeReviewCard).toBeTruthy()
    // because the other card is the active one
    expect(reviewCards.length).toEqual(mockPendingSentences.length - 1)
    spy.mockRestore()
  })

  it('votes yes', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)

    const yesButton = screen.getByTestId('yes-button')
    fireEvent.click(yesButton)

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        vote: true,
        sentence_id: mockPendingSentences[0].sentenceId,
        sentenceIndex: 0,
      })
    })

    spy.mockRestore()
  })

  it('votes no', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)

    const yesButton = screen.getByTestId('no-button')
    fireEvent.click(yesButton)

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        vote: false,
        sentence_id: mockPendingSentences[0].sentenceId,
        sentenceIndex: 0,
      })
    })

    spy.mockRestore()
  })

  it('skips a sentence', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)

    const skipButton = screen.getByTestId('skip-button')
    fireEvent.click(skipButton)

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith(
        mockPendingSentences[0].sentenceId
      )
    })

    spy.mockRestore()
  })

  it('votes yes with keyboard', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)
    const reviewPage = screen.getByTestId('review-page')

    fireEvent.keyDown(reviewPage, { key: 'y', code: 'KeyY', charCode: 89 })

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        vote: true,
        sentence_id: mockPendingSentences[0].sentenceId,
        sentenceIndex: 0,
      })
    })

    spy.mockRestore()
  })

  it('votes no with keyboard', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)
    const reviewPage = screen.getByTestId('review-page')

    fireEvent.keyDown(reviewPage, { key: 'n', code: 'KeyN', charCode: 78 })

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith({
        vote: false,
        sentence_id: mockPendingSentences[0].sentenceId,
        sentenceIndex: 0,
      })
    })

    spy.mockRestore()
  })

  it('skips with keyboard', async () => {
    const spy = jest
      .spyOn(storeHooks, 'useSentences')
      .mockImplementation(() => ({
        'mock-locale-1': {
          sentences: [],
          pendingSentences: mockPendingSentences,
          isLoadingPendingSentences: false,
          isLoading: false,
          hasLoadingError: false,
        },
      }))

    renderWithProviders(<Review />)
    const reviewPage = screen.getByTestId('review-page')

    fireEvent.keyDown(reviewPage, { key: 's', code: 'KeyS', charCode: 83 })

    await waitFor(async () => {
      expect(useActionMock).toHaveBeenCalledWith(
        mockPendingSentences[0].sentenceId
      )
    })

    spy.mockRestore()
  })

  it('redirects to login page for unauthenticated users', () => {
    const spy = jest
      .spyOn(storeHooks, 'useAccount')
      .mockImplementation(() => null)

    renderWithProviders(<Review />)

    expect(window.location.href).toEqual('/login')

    spy.mockRestore()
  })
})
