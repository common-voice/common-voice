import { COOKIE_CONTROL_SCRIPT_URL } from './config'
import {
  getCookieControlApiKey,
  loadCookieControl,
} from './load-cookie-control'

const civicScripts = () =>
  document.querySelectorAll(`script[src="${COOKIE_CONTROL_SCRIPT_URL}"]`)

describe('loadCookieControl', () => {
  afterEach(() => {
    civicScripts().forEach(s => s.remove())
    delete window.CookieControl
  })

  it('does nothing without an API key', () => {
    expect(loadCookieControl('')).toBe(false)
    expect(civicScripts()).toHaveLength(0)
  })

  it('adds the Civic script once', () => {
    expect(loadCookieControl('test-key')).toBe(true)
    expect(loadCookieControl('test-key')).toBe(false)
    expect(civicScripts()).toHaveLength(1)
  })

  it('starts Civic with the config when the script loads', () => {
    const load = jest.fn()
    loadCookieControl('test-key')
    window.CookieControl = { load }

    const script = civicScripts()[0] as HTMLScriptElement
    script.onload?.(new Event('load'))

    expect(load).toHaveBeenCalledTimes(1)
    expect(load.mock.calls[0][0]).toMatchObject({
      apiKey: 'test-key',
      initialState: 'notify',
    })
  })
})

describe('getCookieControlApiKey', () => {
  const original = process.env.COOKIE_CONTROL_API_KEY

  afterEach(() => {
    // assigning undefined to process.env would store the string "undefined"
    if (original === undefined) {
      delete process.env.COOKIE_CONTROL_API_KEY
    } else {
      process.env.COOKIE_CONTROL_API_KEY = original
    }
  })

  it('returns an empty string when not configured', () => {
    delete process.env.COOKIE_CONTROL_API_KEY

    expect(getCookieControlApiKey()).toBe('')
  })

  it('returns the configured key', () => {
    process.env.COOKIE_CONTROL_API_KEY = 'abc'

    expect(getCookieControlApiKey()).toBe('abc')
  })
})
