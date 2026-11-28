import {
  buildCookieControlConfig,
  buildOptionalCookies,
  COOKIE_CONTROL_SCRIPT_URL,
  CookieControlStrings,
} from './config'

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
 * `getStrings` is called when the script has loaded, so the banner starts in
 * the page language even if it changed while the script was downloading.
 *
 * @returns true if the script was added to the page by this call.
 */
export function loadCookieControl(
  apiKey: string,
  getStrings: () => CookieControlStrings
): boolean {
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
      window.CookieControl.load(buildCookieControlConfig(apiKey, getStrings()))
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

/**
 * Opens Civic's preference panel so the visitor can change their choice.
 * When the panel closes, focus goes back to the element that opened it
 * (for example the footer button), so keyboard and screen-reader users
 * don't lose their place on the page.
 */
export function openCookieControl(): void {
  if (typeof window.CookieControl?.open !== 'function') {
    return
  }

  const opener = document.activeElement
  window.CookieControl.open()

  if (opener instanceof HTMLElement && opener !== document.body) {
    returnFocusWhenPanelCloses(opener)
  }
}

// Only one panel can be open, so only one opener is watched at a time.
let panelObserver: MutationObserver | null = null

function returnFocusWhenPanelCloses(opener: HTMLElement): void {
  const root = document.getElementById('ccc')
  if (!root || root.contains(opener)) {
    return
  }

  panelObserver?.disconnect()

  let panelSeen = Boolean(document.getElementById('ccc-content'))
  const observer = new MutationObserver(() => {
    if (document.getElementById('ccc-content')) {
      panelSeen = true
      return
    }
    if (!panelSeen) {
      return
    }

    observer.disconnect()
    panelObserver = null
    // Civic moves focus to its corner button as the panel closes, so wait
    // for that before moving it back.
    setTimeout(() => {
      const active = document.activeElement
      // Leave focus alone if the visitor has already moved it to the page.
      const focusIsCivics = active === document.body || root.contains(active)
      if (opener.isConnected && focusIsCivics) {
        opener.focus()
      }
    })
  })
  observer.observe(root, { childList: true, subtree: true })
  panelObserver = observer
}

/**
 * What Civic is showing right now. Civic removes the bar and the panel from
 * the page when they close.
 */
export function getVisibleState(): 'open' | 'notify' | 'closed' {
  if (document.querySelector('#ccc-content')) return 'open'
  if (document.querySelector('#ccc-notify')) return 'notify'
  return 'closed'
}

/**
 * Re-renders the banner in a new language, keeping the visitor's choice.
 * Common Voice switches language without a page reload, so the text Civic
 * was started with has to be replaced. Does nothing before Civic has loaded.
 */
export function updateCookieControlText(strings: CookieControlStrings): void {
  if (typeof window.CookieControl?.update === 'function') {
    window.CookieControl.update({
      text: strings.text,
      optionalCookies: buildOptionalCookies(strings),
      // update() re-renders from initialState, which would bring the bar back
      // after the visitor has already chosen. Keep what is on screen instead.
      initialState: getVisibleState(),
    })
  }
}
