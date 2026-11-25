import { useEffect, useMemo, useRef } from 'react'
import { useLocalization } from '@fluent/react'

import {
  getCookieControlApiKey,
  loadCookieControl,
  updateCookieControlText,
} from './load-cookie-control'
import { getCookieControlStrings } from './strings'

import './cookie-consent.css'

/**
 * Starts the Civic Cookie Control banner once the app has mounted, and keeps
 * its text in the page language. Civic renders its own UI, so this component
 * renders nothing.
 */
const CookieConsent = (): null => {
  const { l10n } = useLocalization()
  // The parent re-renders often, so only rebuild the strings when the
  // language changes. The ref lets the script's onload read the latest ones.
  const latestStrings = useMemo(() => getCookieControlStrings(l10n), [l10n])
  const strings = useRef(latestStrings)
  strings.current = latestStrings

  useEffect(() => {
    loadCookieControl(getCookieControlApiKey(), () => strings.current)
  }, [])

  useEffect(() => {
    updateCookieControlText(latestStrings)
  }, [latestStrings])

  return null
}

export default CookieConsent
