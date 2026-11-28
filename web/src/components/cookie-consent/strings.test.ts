import * as fs from 'fs'
import * as path from 'path'

import { getCookieControlStrings } from './strings'

const FTL_PATH = path.join(
  __dirname,
  '../../../locales/common-voice/en/cookie-consent.ftl'
)

describe('getCookieControlStrings', () => {
  it('maps Fluent ids to Civic text keys', () => {
    const strings = getCookieControlStrings({ getString: (id: string) => id })

    expect(strings.text.notifyTitle).toBe('cookie-consent-notify-title')
    expect(strings.text.accept).toBe('cookie-consent-accept-all')
    // Both "Reject All" buttons share one string
    expect(strings.text.reject).toBe('cookie-consent-reject-all')
    expect(strings.text.rejectSettings).toBe('cookie-consent-reject-all')
    expect(strings.analytics.label).toBe('cookie-consent-analytics-label')
  })

  it('only uses ids defined in the English .ftl file', () => {
    const defined = new Set(
      fs
        .readFileSync(FTL_PATH, 'utf8')
        .split('\n')
        .map(line => line.match(/^([a-z-]+) =/)?.[1])
        .filter(Boolean)
    )
    const used: string[] = []
    getCookieControlStrings({
      getString: (id: string) => {
        used.push(id)
        return id
      },
    })

    expect(used.filter(id => !defined.has(id))).toEqual([])
  })
})
