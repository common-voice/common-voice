import {
  ANALYTICS_COOKIES,
  BANNER_COLORS,
  BRANDING,
  buildCookieControlConfig,
  COOKIE_CONTROL_PRODUCT,
  NECESSARY_COOKIES,
} from './config'
import { getCookieControlStrings } from './strings'

// Each string is its Fluent id, so tests can see where text came from.
const STRINGS = getCookieControlStrings({ getString: (id: string) => id })

describe('buildCookieControlConfig', () => {
  const gtag = jest.fn()

  beforeEach(() => {
    window.gtag = gtag
  })

  afterEach(() => {
    gtag.mockReset()
    delete window.gtag
  })

  const category = (name: string) => {
    const found = buildCookieControlConfig(
      'test-key',
      STRINGS
    ).optionalCookies.find(c => c.name === name)
    if (!found) throw new Error(`missing category ${name}`)
    return found
  }

  it('passes the API key and product through', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.apiKey).toBe('test-key')
    expect(config.product).toBe(COOKIE_CONTROL_PRODUCT)
    expect(config.initialState).toBe('notify')
  })

  it('keeps the consent cookie off other mozilla.org sites', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.subDomains).toBe(false)
  })

  it('applies the Common Voice branding without a page overlay', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.branding).toBe(BRANDING)
    expect(config.branding.backgroundColor).toBe(BANNER_COLORS.violet)
    expect(config.accessibility.overlay).toBe(false)
  })

  it('uses the localized text for the banner and categories', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.text).toBe(STRINGS.text)
    expect(category('analytics')).toMatchObject({
      label: 'cookie-consent-analytics-label',
      description: 'cookie-consent-analytics-description',
    })
  })

  it('keeps Common Voice and donation form cookies as necessary', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.necessaryCookies).toBe(NECESSARY_COOKIES)
    expect(config.necessaryCookies).toEqual(
      expect.arrayContaining([
        'mcv_session',
        'mcv_features',
        '__stripe_mid',
        'm',
        'hmt_id',
        '__cf_bm',
        '__cflb',
      ])
    )
  })

  it('has an analytics category only', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.optionalCookies.map(c => c.name)).toEqual(['analytics'])
    expect(category('analytics').cookies).toBe(ANALYTICS_COOKIES)
  })

  it('does not list a cookie as both necessary and optional', () => {
    expect(
      NECESSARY_COOKIES.filter(c => ANALYTICS_COOKIES.includes(c))
    ).toEqual([])
  })

  it('grants and revokes analytics storage through Consent Mode', () => {
    category('analytics').onAccept()
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      analytics_storage: 'granted',
    })

    category('analytics').onRevoke()
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      analytics_storage: 'denied',
    })
  })

  it('does not throw when gtag is not on the page', () => {
    delete window.gtag

    expect(() => category('analytics').onAccept()).not.toThrow()
  })
})
