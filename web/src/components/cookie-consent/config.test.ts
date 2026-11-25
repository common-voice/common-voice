import {
  ANALYTICS_COOKIES,
  BANNER_COLORS,
  BRANDING,
  buildCookieControlConfig,
  COOKIE_CONTROL_PRODUCT,
  MARKETING_COOKIES,
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
    expect(category('marketing').label).toBe('cookie-consent-marketing-label')
  })

  it('keeps Common Voice cookies as necessary', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.necessaryCookies).toBe(NECESSARY_COOKIES)
    expect(config.necessaryCookies).toEqual(
      expect.arrayContaining(['mcv_session', 'mcv_features'])
    )
  })

  it('defines analytics and marketing categories', () => {
    const config = buildCookieControlConfig('test-key', STRINGS)

    expect(config.optionalCookies.map(c => c.name)).toEqual([
      'analytics',
      'marketing',
    ])
    expect(category('analytics').cookies).toBe(ANALYTICS_COOKIES)
    expect(category('marketing').cookies).toBe(MARKETING_COOKIES)
  })

  it('does not list a cookie as both necessary and optional', () => {
    const optional = [...ANALYTICS_COOKIES, ...MARKETING_COOKIES]

    expect(NECESSARY_COOKIES.filter(c => optional.includes(c))).toEqual([])
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

  it('grants and revokes ad storage through Consent Mode', () => {
    category('marketing').onAccept()
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_personalization: 'granted',
      ad_user_data: 'granted',
    })

    category('marketing').onRevoke()
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_personalization: 'denied',
      ad_user_data: 'denied',
    })
  })

  it('does not throw when gtag is not on the page', () => {
    delete window.gtag

    expect(() => category('analytics').onAccept()).not.toThrow()
  })
})
