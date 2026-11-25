import * as React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CookiePreferencesButton from './cookie-preferences-button'
import { renderWithProviders } from '../../../test/render-with-providers'

describe('CookiePreferencesButton', () => {
  const original = process.env.COOKIE_CONTROL_API_KEY

  afterEach(() => {
    if (original === undefined) {
      delete process.env.COOKIE_CONTROL_API_KEY
    } else {
      process.env.COOKIE_CONTROL_API_KEY = original
    }
    delete window.CookieControl
  })

  it('is hidden when the banner is turned off', () => {
    delete process.env.COOKIE_CONTROL_API_KEY

    renderWithProviders(<CookiePreferencesButton />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('opens the preference panel', () => {
    process.env.COOKIE_CONTROL_API_KEY = 'test-key'
    const open = jest.fn()
    window.CookieControl = { open }

    renderWithProviders(<CookiePreferencesButton />)
    userEvent.click(screen.getByRole('button'))

    expect(open).toHaveBeenCalledTimes(1)
  })

  it('does not throw before Civic has loaded', () => {
    process.env.COOKIE_CONTROL_API_KEY = 'test-key'

    renderWithProviders(<CookiePreferencesButton />)

    expect(() => userEvent.click(screen.getByRole('button'))).not.toThrow()
  })
})
