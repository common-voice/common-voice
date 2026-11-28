import { deleteCookie, setCookie } from './cookie'

describe('setCookie', () => {
  let cookieSetter: jest.SpyInstance

  beforeEach(() => {
    // jsdom runs on http://localhost and drops `secure` cookies, so inspect
    // the raw string written to document.cookie instead of reading it back.
    cookieSetter = jest.spyOn(document, 'cookie', 'set')
  })

  afterEach(() => {
    cookieSetter.mockRestore()
  })

  const lastCookieString = (): string =>
    cookieSetter.mock.calls[cookieSetter.mock.calls.length - 1][0]

  it('defaults samesite to lax', () => {
    setCookie('test', 'value')

    expect(lastCookieString()).toContain('; samesite=lax')
  })

  it('uses the samesite option when given', () => {
    setCookie('test', 'value', { sameSite: 'strict' })

    expect(lastCookieString()).toContain('; samesite=strict')
  })

  it('applies the default path and secure flag', () => {
    setCookie('test', 'value')

    expect(lastCookieString()).toContain('; path=/')
    expect(lastCookieString()).toContain('; secure')
  })

  it('expires the cookie in the past when deleting', () => {
    deleteCookie('test')

    const expires = lastCookieString().match(/expires=([^;]+)/)?.[1]
    expect(new Date(expires).getTime()).toBeLessThan(Date.now())
  })
})
