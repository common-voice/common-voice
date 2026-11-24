import { buildCookieControlConfig, COOKIE_CONTROL_SCRIPT_URL } from './config'

// Injected at build time by webpack's DefinePlugin from CV_COOKIE_CONTROL_API_KEY.
export function getCookieControlApiKey(): string {
  return process.env.COOKIE_CONTROL_API_KEY || ''
}

/**
 * Loads the Civic Cookie Control script and starts the banner.
 *
 * Does nothing when no API key is configured, so local setups and builds
 * without a key keep working without a banner. Safe to call more than once:
 * the script is only added to the page the first time.
 *
 * @returns true if the script was added to the page by this call.
 */
export function loadCookieControl(apiKey: string): boolean {
  if (!apiKey) {
    return false
  }

  const alreadyAdded = document.querySelector(
    `script[src="${COOKIE_CONTROL_SCRIPT_URL}"]`
  )
  if (alreadyAdded) {
    return false
  }

  const script = document.createElement('script')
  script.src = COOKIE_CONTROL_SCRIPT_URL
  script.async = true
  script.onload = () => {
    if (window.CookieControl) {
      window.CookieControl.load(buildCookieControlConfig(apiKey))
    } else {
      console.warn('Cookie Control script loaded but CookieControl is missing')
    }
  }
  script.onerror = () => {
    console.warn('Failed to load the Cookie Control script')
  }
  document.body.appendChild(script)

  return true
}
