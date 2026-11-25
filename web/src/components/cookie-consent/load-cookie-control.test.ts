import { COOKIE_CONTROL_SCRIPT_URL } from './config'
import {
  getCookieControlApiKey,
  getVisibleState,
  loadCookieControl,
  updateCookieControlText,
} from './load-cookie-control'
import { getCookieControlStrings } from './strings'

const civicScripts = () =>
  document.querySelectorAll(`script[src="${COOKIE_CONTROL_SCRIPT_URL}"]`)

// Strings in a given "language": each value is `${lang}:${fluent id}`.
const stringsIn = (lang: string) =>
  getCookieControlStrings({ getString: (id: string) => `${lang}:${id}` })

describe('loadCookieControl', () => {
  afterEach(() => {
    civicScripts().forEach(s => s.remove())
    delete window.CookieControl
  })

  it('does nothing without an API key', () => {
    expect(loadCookieControl('', () => stringsIn('en'))).toBe(false)
    expect(civicScripts()).toHaveLength(0)
  })

  it('adds the Civic script once', () => {
    expect(loadCookieControl('test-key', () => stringsIn('en'))).toBe(true)
    expect(loadCookieControl('test-key', () => stringsIn('en'))).toBe(false)
    expect(civicScripts()).toHaveLength(1)
  })

  it('starts Civic with the config when the script loads', () => {
    const load = jest.fn()
    loadCookieControl('test-key', () => stringsIn('en'))
    window.CookieControl = { load }

    const script = civicScripts()[0] as HTMLScriptElement
    script.onload?.(new Event('load'))

    expect(load).toHaveBeenCalledTimes(1)
    expect(load.mock.calls[0][0]).toMatchObject({
      apiKey: 'test-key',
      initialState: 'notify',
    })
  })

  it('uses the language current when the script loads', () => {
    const load = jest.fn()
    let lang = 'en'
    loadCookieControl('test-key', () => stringsIn(lang))
    lang = 'fr' // the visitor switched language while the script downloaded
    window.CookieControl = { load }

    const script = civicScripts()[0] as HTMLScriptElement
    script.onload?.(new Event('load'))

    expect(load.mock.calls[0][0].text.notifyTitle).toBe(
      'fr:cookie-consent-notify-title'
    )
  })
})

describe('updateCookieControlText', () => {
  afterEach(() => {
    delete window.CookieControl
  })

  it('replaces the banner text and category labels', () => {
    const update = jest.fn()
    window.CookieControl = { update }

    updateCookieControlText(stringsIn('de'))

    const config = update.mock.calls[0][0]
    expect(config.text.accept).toBe('de:cookie-consent-accept-all')
    expect(config.optionalCookies[0].label).toBe(
      'de:cookie-consent-analytics-label'
    )
  })

  it('does nothing before Civic has loaded', () => {
    expect(() => updateCookieControlText(stringsIn('de'))).not.toThrow()
  })

  it('keeps the bar closed once the visitor has chosen', () => {
    const update = jest.fn()
    window.CookieControl = { update }

    updateCookieControlText(stringsIn('de'))

    expect(update.mock.calls[0][0].initialState).toBe('closed')
  })
})

describe('getVisibleState', () => {
  const show = (id: string) => {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
    return el
  }

  it('reports what Civic is showing', () => {
    expect(getVisibleState()).toBe('closed')

    const bar = show('ccc-notify')
    expect(getVisibleState()).toBe('notify')

    const panel = show('ccc-content')
    expect(getVisibleState()).toBe('open')

    bar.remove()
    panel.remove()
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
