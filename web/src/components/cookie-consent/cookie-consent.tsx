import { useEffect } from 'react'

import {
  getCookieControlApiKey,
  loadCookieControl,
} from './load-cookie-control'

/**
 * Starts the Civic Cookie Control banner once the app has mounted.
 * Civic renders its own UI, so this component renders nothing.
 */
const CookieConsent = (): null => {
  useEffect(() => {
    loadCookieControl(getCookieControlApiKey())
  }, [])

  return null
}

export default CookieConsent
