import { UserClient } from 'common'
import URLS from './urls'
import { SmallBatchResponse } from './components/pages/contribution/sentence-collector/write/sentence-write/types'

const SEARCH_REG_EXP = new RegExp('</?[^>]+(>|$)', 'g')
const MS_IN_HOUR = 3600000

/**
 * Generate RFC4122 compliant globally unique identifier.
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function dec2hex(n: number) {
  return ('0' + n.toString(16)).substr(-2)
}

export function generateToken(length = 40) {
  const arr = new Uint8Array(length / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

/**
 * Count the syllables in a string. Completely stolen from:
 * https://codegolf.stackexchange.com/
 *   questions/47322/how-to-count-the-syllables-in-a-word
 */
const re = /[aiouy]+e*|e(?!d$|ly).|[td]ed|le$/gi
export function countSyllables(text: string): number {
  const matches = text.match(re)
  return matches.length
}

/**
 * Test whether this is an in-app-browser (WebView).
 *
 * Detects browsers embedded within apps (Facebook, Instagram, etc.) where
 * audio recording and other web features may be restricted or broken.
 * Uses both modern userAgentData API and legacy UA string detection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
 */
export function isWebView(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()

  // iOS WebView detection: Has AppleWebKit but NOT Safari in user agent
  // This catches WKWebView, UIWebView, and most in-app browsers on iOS
  const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(
    navigator.userAgent
  )

  // Android WebView detection:
  // - "; wv)" in UA string indicates WebView explicitly
  // - window._webview is sometimes exposed by WebView implementations
  const isAndroidWebView =
    /; wv\)/.test(userAgent) || typeof (window as any)._webview !== 'undefined'

  // Common social media in-app browser signatures
  // These apps embed their own browser that may have limited capabilities
  const webViewSignatures = {
    isFacebook: /fbav|fban|fb_iab\/|fb4a|fb1a|facebook/i.test(userAgent),
    isInstagram: /instagram/i.test(userAgent),
    isTwitter: /twitter/i.test(userAgent),
    isSnapchat: /snapchat/i.test(userAgent),
    isLinkedIn: /linkedinapp/i.test(userAgent),
    isTikTok: /tiktok/i.test(userAgent),
    isWeChat: /micromessenger/i.test(userAgent),
    isLine: /line/i.test(userAgent),
    isPinterest: /pinterest/i.test(userAgent),
    isReddit: /\breddit\b/i.test(userAgent),
    isSlack: /slack/i.test(userAgent),
    isDiscord: /discord/i.test(userAgent),
    isTelegram: /telegram/i.test(userAgent),
  }

  // Additional heuristics for WebView detection:
  // 1. Check if userAgentData is missing (WebViews often don't implement it)
  // 2. Some WebViews have limited window features
  const hasLimitedFeatures =
    'userAgentData' in navigator &&
    !(navigator.userAgentData as any)?.brands?.length

  // Aggregate all detection methods
  const isDetectedWebView =
    isIOSWebView ||
    isAndroidWebView ||
    Object.values(webViewSignatures).some(value => value === true) ||
    hasLimitedFeatures

  return isDetectedWebView
}

/**
 * Test whether this is a browser on iOS.
 *
 * Uses modern navigator.userAgentData API when available, with fallback to UA string.
 * For iPadOS 13+, iPads may identify as macOS unless requesting mobile site.
 * Touch detection helps identify touch-enabled devices like iPads.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
 */
export function isIOS(): boolean {
  // Modern approach: Use User-Agent Client Hints API if available
  if ('userAgentData' in navigator && navigator.userAgentData) {
    const uaData = navigator.userAgentData as { platform?: string }
    const platform = uaData.platform?.toLowerCase() || ''
    if (platform === 'ios' || platform === 'iphone' || platform === 'ipad') {
      return true
    }
  }

  // Legacy approach: Check user agent string
  if (/iPod|iPhone|iPad|iOS/i.test(navigator.userAgent)) {
    return true
  }

  // iPadOS 13+ detection: iPads masquerade as macOS in desktop mode
  // Check for Mac + touch support (iPads have touch, Macs don't)
  const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent)
  const hasTouchPoints =
    navigator.maxTouchPoints && navigator.maxTouchPoints > 1

  return isMacOS && hasTouchPoints
}

/**
 * Check whether the browser is mobile Safari on iOS.
 *
 * Detects actual Safari browser vs other browsers on iOS (Chrome, Firefox, etc.).
 * Uses standards-compliant display-mode media query for PWA/standalone detection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode
 * @see https://stackoverflow.com/q/3007480
 */
export function isMobileSafari(): boolean {
  if (!isIOS()) {
    return false
  }

  const ua = navigator.userAgent

  // Check for the most common non-Safari browsers on iOS
  // Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS)
  const isCommonOtherBrowser = /CriOS|FxiOS|EdgiOS/i.test(ua)
  if (isCommonOtherBrowser) {
    return false
  }

  // Note: All iOS browsers historically used WebKit (Apple requirement),
  // but as of iOS 17.4+ (March 2024), EU users can use alternative engines.
  // Checking for WebKit would incorrectly exclude EU users with Gecko/Blink.
  // Instead, we rely on the presence of "Safari" marker.

  // Check for Safari-specific markers
  const hasSafari = /Safari/i.test(ua)

  // In standalone mode (PWA/home screen), might not have Safari marker
  // Use standards-compliant display-mode media query instead of non-standard navigator.standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  // It's Safari if it has the Safari marker or is in standalone mode
  // We accept that some rare browsers might be misidentified, but the
  // consequence (hover behavior) is minor
  return hasSafari || isStandalone
}

/**
 * Detects Safari browser on macOS (desktop).
 * Uses positive detection: Safari uniquely has "Version/X.X" pattern without "Chrome".
 * This is more robust than maintaining a list of all Chromium-based browsers.
 *
 * Excludes iOS Safari (use isMobileSafari for that) and all other browsers on macOS.
 */
export function isMacOSSafari(): boolean {
  if (isIOS()) {
    return false
  }

  const ua = navigator.userAgent

  // Must be on macOS
  const isMacOS = /Mac OS X|Macintosh/i.test(ua)
  if (!isMacOS) {
    return false
  }

  // Safari's unique signature: has "Safari" AND "Version/X.X" but NOT "Chrome"
  // Chrome-based browsers (Chrome, Edge, Brave, Arc, Vivaldi, Yandex, etc.)
  // include both "Safari" and "Chrome" in their UA
  // True Safari has "Version/" which Chrome-based browsers typically don't
  const hasSafari = /Safari/i.test(ua)
  const hasVersion = /Version\/[\d.]+/i.test(ua)
  const hasChrome = /Chrome|Chromium/i.test(ua)
  const hasFirefox = /Firefox/i.test(ua)

  // Exclude WebKit-based browsers that mimic Safari's pattern:
  // - Orion Browser (WebKit-based, has "Version/" like Safari)
  // - DuckDuckGo Browser (privacy browser that may spoof Safari)
  // - SigmaOS (privacy-focused browser)
  const isSpoofed = /Orion|DuckDuckGo|SigmaOS/i.test(ua)

  // True Safari: has Safari + Version markers, but NO Chrome/Chromium/Firefox/spoofed browsers
  return hasSafari && hasVersion && !hasChrome && !hasFirefox && !isSpoofed
}

export function isMobileResolution(): boolean {
  return window.matchMedia('(max-width: 768px)').matches
}

export function isProduction(): boolean {
  return window.location.origin === URLS.HTTP_ROOT
}

export function isStaging(): boolean {
  return window.location.origin === URLS.STAGING_ROOT
}

export function shouldEmitErrors(): boolean {
  return isStaging() || isProduction() ? true : false
}

/**
 * Replaces the locale part of a given path
 */
export function replacePathLocale(pathname: string, locale: string) {
  const pathParts = pathname.split('/')
  pathParts[1] = locale
  return pathParts.join('/')
}

export function getManageSubscriptionURL(account: UserClient) {
  const [firstLanguage] = account.languages
  return `https://www.mozilla.org/${
    firstLanguage ? firstLanguage.locale + '/' : ''
  }newsletter/existing/${account.basket_token}`
}

/**
 * Get the appropriate audio format for MediaRecorder.
 * Note: Caller should not force this format on iOS/Safari - they work better with defaults.
 */
export const getAudioFormat = () => {
  // iOS/macOS Safari => MP4/AAC
  if (isIOS() || isMacOSSafari()) {
    // Prefer AAC-LC (mp4a.40.2) - most compatible AAC profile
    // This is the baseline AAC profile that Safari/WebKit encoders produce
    // and ensures predictable quality/compatibility across Apple devices
    if (MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) {
      return 'audio/mp4;codecs=mp4a.40.2'
    }
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return 'audio/mp4'
    }
    // Fallback - check WebM support
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      return 'audio/webm;codecs=opus'
    }
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      return 'audio/webm'
    }
  }

  // All other platforms => WebM/Opus
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus'
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm'
  }

  // Let MediaRecorder choose default
  return ''
}

export async function hash(text: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const digest = await window.crypto.subtle.digest('SHA-256', data)

  return [...new Uint8Array(digest)]
    .map(value => value.toString(16).padStart(2, '0'))
    .join('')
}

export function stringContains(haystack: string, needles: string) {
  return (
    haystack.toUpperCase().replace(SEARCH_REG_EXP, '').indexOf(needles) !== -1
  )
}

export function doNotTrack() {
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'
}

export function byteToSize(bytes: number, getString: Function): string {
  const megabytes = bytes / 1024 / 1024
  return megabytes < 1
    ? Math.round(megabytes * 100) / 100 + ' ' + getString('size-megabyte')
    : megabytes > 1024
    ? Math.round(megabytes / 1024) + ' ' + getString('size-gigabyte')
    : Math.round(megabytes) + ' ' + getString('size-megabyte')
}

export const formatBytes = (bytes: number, locale: string) => {
  const sizes = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte']
  if (bytes > 0) {
    const DECIMAL_PLACES = 2
    const BYTES_IN_KILOBYTE = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(BYTES_IN_KILOBYTE))

    return parseFloat(
      (bytes / Math.pow(BYTES_IN_KILOBYTE, i)).toFixed(DECIMAL_PLACES)
    ).toLocaleString(locale, {
      style: 'unit',
      unit: sizes[i],
    })
  } else {
    const ZERO = 0
    return ZERO.toLocaleString(locale, {
      style: 'unit',
      unit: sizes[ZERO],
    })
  }
}

export const msToHours = (msDuration: number) => {
  return Math.ceil(msDuration / MS_IN_HOUR)
}

export const castTrueString = (strValue: string) => strValue === 'true'

export const formatNumberToPercentage = (numberValue: number) =>
  `${Math.round(numberValue * 100)}%`

export const sortObjectByValue = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a))

// converts an array of invalid small sentences to a TSV string
export const invalidSmallBatchSentencesToTSVString = (
  data: SmallBatchResponse['invalidSentences']
) => {
  if (!data || data.length === 0) {
    return ''
  }

  const tsvString = [
    ['Sentence', 'Error'],
    ...data.map(item => [item.sentence, item.errorType]),
  ]
    .map(e => e.join('\t'))
    .join('\n')

  return tsvString
}

export const typedObjectKeys = <T extends object>(object: T): (keyof T)[] =>
  Object.keys(object) as (keyof T)[]
