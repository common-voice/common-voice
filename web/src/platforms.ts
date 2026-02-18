// Platform Detection helpers / utilities

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent
  const isIOSDevice = /iPad|iPhone|iPod/i.test(ua)
  const isIPadOS13OrNewer =
    /Macintosh/i.test(ua) &&
    'maxTouchPoints' in navigator &&
    (navigator as any).maxTouchPoints > 1

  return isIOSDevice || isIPadOS13OrNewer
}

export function isMacOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent

  // Must be macOS
  const isMacOS = /Mac OS X|Macintosh/i.test(ua)
  if (!isMacOS) return false

  // Safari signature: has "Safari" + "Version/X.X" but NOT "Chrome"
  const hasSafari = /Safari/i.test(ua)
  const hasVersion = /Version\/[\d.]+/i.test(ua)
  const hasChrome = /Chrome|Chromium/i.test(ua)
  const hasFirefox = /Firefox/i.test(ua)

  // Exclude WebKit browsers that mimic Safari
  const isSpoofed = /Orion|DuckDuckGo|SigmaOS|Brave/i.test(ua)

  return hasSafari && hasVersion && !hasChrome && !hasFirefox && !isSpoofed
}

export function isMobileSafari(): boolean {
  if (!isIOS()) return false

  const ua = navigator.userAgent

  // Exclude other iOS browsers
  if (/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua)) return false

  const hasSafari = /Safari/i.test(ua)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  return hasSafari || isStandalone
}

export type BrowserEnvironment = 'browser' | 'in_app' | 'webview'

/**
 * Detects the browser environment to determine MediaRecorder reliability.
 *
 * @returns 'webview' for embedded browsers that typically break MediaRecorder,
 *          'in_app' for in-app browsers that may work but are unreliable,
 *          'browser' for standalone browsers with full capabilities
 */
export function detectBrowserEnvironment(): BrowserEnvironment {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return 'browser' // SSR fallback
  }

  const ua = navigator.userAgent.toLowerCase()

  // ============================================================================
  // iOS WebView Detection
  // ============================================================================

  // Classic iOS WebView pattern (no Safari in UA)
  // Matches WKWebView and UIWebView
  const isClassicIOSWebView =
    /(iphone|ipad|ipod).*applewebkit(?!.*safari)/i.test(ua)

  // iOS 17.4+ WebView (EU alternative browsers)
  // In WebViews, even if Safari marker exists, certain APIs are missing
  const isModernIOSDevice = /iphone|ipad|ipod/i.test(ua)

  let isModernIOSWebView = false
  if (isModernIOSDevice) {
    // Check for WebView indicators:
    // 1. Not standalone PWA
    // 2. Not in browser display mode
    // 3. Missing certain Safari-specific APIs (when available)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    const isBrowserMode = window.matchMedia('(display-mode: browser)').matches

    // Safari has a unique constructor pattern
    const hasSafariSpecificAPIs =
      'safari' in window || // Safari namespace
      'ApplePaySession' in window // Apple Pay (Safari-specific on iOS)

    isModernIOSWebView =
      !isStandalone && !isBrowserMode && !hasSafariSpecificAPIs
  }

  // ============================================================================
  // Android WebView Detection
  // ============================================================================

  // Standard Android WebView markers
  const hasAndroidWebViewMarker = /\bwv\b|; wv\)/i.test(ua)

  // Android Chrome WebView (often has "Version/" without "Chrome/[version]")
  const isAndroidChromeWebView =
    /android/i.test(ua) && /version\/\d+/i.test(ua) && !/chrome\/\d+/i.test(ua)

  // Some Android WebViews identify as "Mobile Safari"
  const isSuspiciousAndroidUA =
    /android/i.test(ua) &&
    /mobile.*safari/i.test(ua) &&
    !/chrome|firefox|samsung|opera/i.test(ua)

  const isAndroidWebView =
    hasAndroidWebViewMarker || isAndroidChromeWebView || isSuspiciousAndroidUA

  if (isClassicIOSWebView || isModernIOSWebView || isAndroidWebView) {
    return 'webview'
  }

  // ============================================================================
  // Severely Broken In-App Browsers (treat as webviews)
  // ============================================================================

  const severelyBrokenInAppUAs = [
    // Facebook family (notoriously broken)
    /\bfb_iab\b/i, // Facebook In-App Browser (explicit marker)
    /\bfbav\b/i, // Facebook App (iOS)
    /\bfban\b/i, // Facebook App (Android)
    /\bfb4a\b/i, // Facebook for Android
    /\bfb1a\b/i, // Facebook for iOS (legacy)
    /\bfbsv\b/i, // Facebook SDK Version

    /instagram/i, // Instagram (uses Facebook's broken WebView)

    /tiktok/i, // TikTok (extremely limited WebView)
    /bytedance/i, // TikTok's parent company identifier

    /snapchat/i, // Snapchat (very restrictive)

    /micromessenger/i, // WeChat (China) - very locked down

    /pinterest/i, // Pinterest (limited capabilities)

    /\bline\b/i, // Line (Japan/SEA messaging app)

    /whatsapp/i, // WhatsApp in-app browser

    /\bqq\b.*browser/i, // QQ Browser (China)
  ]

  if (severelyBrokenInAppUAs.some(r => r.test(ua))) {
    return 'webview'
  }

  // ============================================================================
  // Moderately Unreliable In-App Browsers
  // ============================================================================

  const moderateInAppUAs = [
    /telegram/i, // Telegram (better than Facebook but still has quirks)
    /discord/i, // Discord (Electron-based on desktop, WebView on mobile)
    /slack/i, // Slack (similar to Discord)
    /reddit/i, // Reddit (varies by platform)

    /linkedinapp/i, // LinkedIn
    /linkedin.*app/i, // LinkedIn

    /twitter.*app|x\.com.*app/i, // Twitter / X app

    // Other professional/social apps
    /teams/i, // Microsoft Teams
    /outlook/i, // Outlook mobile
    /notion/i, // Notion app
    /obsidian/i, // Obsidian note-taking

    // News/content apps
    /flipboard/i,
    /feedly/i,
    /pocket/i,

    // Email clients with in-app browsers
    /gmail/i,
    /\bymail\b/i, // Yahoo Mail
    /protonmail/i,

    // Messaging apps
    /messenger/i, // Facebook Messenger (less broken than main FB app)
    /viber/i,
    /kakaotalk/i, // KakaoTalk (Korea)
    /zalo/i, // Zalo (Vietnam)
  ]

  if (moderateInAppUAs.some(r => r.test(ua))) {
    return 'in_app'
  }

  // ============================================================================
  // Additional Rare/Edge Cases
  // ============================================================================

  // Electron apps (desktop apps using Chromium)
  // Usually reliable but worth flagging for analytics
  const isElectron =
    /electron/i.test(ua) || (window as any).process?.type === 'renderer'

  // PWAs in standalone mode (usually reliable)
  const isPWA =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true

  const isHuaweiBrowser = /huawei.*browser|hbrowser/i.test(ua) // Huawei Browser (can be quirky)

  const isUCBrowser = /ucbrowser|ucweb/i.test(ua) // UC Browser (popular in Asia, has quirks)

  const isOperaMini = /opera mini/i.test(ua) // Opera Mini (proxy-based, very limited)

  const isSamsungInternet = /samsungbrowser/i.test(ua) // Samsung Internet (generally good but has had issues)

  // If any of these edge cases, could be flagged but we'll treat as 'browser'
  // We might want to add telemetry here
  if (
    isElectron ||
    isPWA ||
    isHuaweiBrowser ||
    isUCBrowser ||
    isOperaMini ||
    isSamsungInternet
  ) {
    // Maybe add logging/telemetry for these cases
    // console.debug('[browser-env] Edge case detected:', {
    //   isElectron,
    //   isPWA,
    //   isHuaweiBrowser,
    //   isUCBrowser,
    //   isOperaMini,
    //   isSamsungInternet,
    // })
  }

  // ============================================================================
  // Default: Standalone Browser
  // ============================================================================

  return 'browser'
}

/**
 * Extended type with additional granularity for advanced use cases
 */
export type ExtendedBrowserEnvironment =
  | BrowserEnvironment
  | 'pwa'
  | 'electron'
  | 'regional_browser'

/**
 * Returns more granular environment information if needed
 */
export function detectExtendedBrowserEnvironment(): ExtendedBrowserEnvironment {
  const baseEnv = detectBrowserEnvironment()

  if (baseEnv !== 'browser') {
    return baseEnv
  }

  const ua = navigator.userAgent.toLowerCase()

  // Check for PWA
  const isPWA =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  if (isPWA) return 'pwa'

  // Check for Electron
  const isElectron =
    /electron/i.test(ua) || (window as any).process?.type === 'renderer'
  if (isElectron) return 'electron'

  // Check for regional browsers (UC, Huawei, etc.)
  const isRegionalBrowser = /ucbrowser|ucweb|huawei.*browser|hbrowser/i.test(ua)
  if (isRegionalBrowser) return 'regional_browser'

  return 'browser'
}

/**
 * Helper to determine if MediaRecorder is likely to work reliably
 */
export function isMediaRecorderReliable(): boolean {
  const env = detectBrowserEnvironment()

  // WebViews are almost never reliable
  if (env === 'webview') return false

  // In-app browsers are hit or miss
  if (env === 'in_app') {
    // Could add more granular checks here
    // For now, consider them unreliable
    return false
  }

  // Standalone browsers should work (but check for MediaRecorder support)
  return 'MediaRecorder' in window
}

/**
 * Test whether this is an in-app-browser (WebView).
 * Detects browsers embedded within apps (Facebook, Instagram, etc.) where
 * audio recording and other web features may be restricted or broken.
 */
export function isWebView(): boolean {
  const env = detectBrowserEnvironment()
  return env === 'webview' || env === 'in_app'
}

/**
 * Returns the best supported audio MIME type for MediaRecorder on this platform.
 *
 * @returns undefined if MediaRecorder is not supported or no suitable type found.
 *          On iOS/Safari, returns undefined to use default encoder (MP4/AAC).
 *          On other platforms, returns the best supported type (prefer WebM/Opus).
 */
export function getBestAudioMimeType(): string | undefined {
  if (typeof window === 'undefined' || !('MediaRecorder' in window))
    return undefined

  // On Safari/iOS, explicitly return MP4/AAC format
  // Explicit MIME type ensures proper blob.type and backend detection
  if (isIOS() || isMacOSSafari()) {
    // Use explicit format for better compatibility
    return MediaRecorder.isTypeSupported('audio/mp4;codecs=aac')
      ? 'audio/mp4;codecs=aac'
      : 'audio/mp4'
  }

  // All other platforms: prefer WebM/Opus (better quality, smaller size)
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ]

  return candidates.find(t => MediaRecorder.isTypeSupported(t))
}
