import * as React from 'react'
import { Localized } from '@fluent/react'

import { TextButton } from '../ui/ui'
import {
  getCookieControlApiKey,
  openCookieControl,
} from './load-cookie-control'

/**
 * Footer button that reopens the cookie preference panel, so visitors can
 * change their choice at any time. Hidden when the banner is turned off
 * (no Civic API key), because there would be nothing to open.
 */
const CookiePreferencesButton = ({ className }: { className?: string }) => {
  if (!getCookieControlApiKey()) {
    return null
  }

  return (
    <Localized id="cookie-consent-footer-link">
      <TextButton className={className} onClick={openCookieControl} />
    </Localized>
  )
}

export default CookiePreferencesButton
