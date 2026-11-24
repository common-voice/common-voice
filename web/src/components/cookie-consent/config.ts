/*
 * Civic Cookie Control configuration for the Common Voice cookie consent banner.
 * Docs: https://cookiecontrol.com/docs/v9/
 *
 * Mirrors the Mozilla Foundation setup (foundation.mozilla.org PR #16161):
 * Google tags start with consent denied (see web/consent/consent-defaults.js)
 * and the optional categories below grant or revoke it through Google Consent
 * Mode when the visitor makes a choice.
 *
 * Keep the cookie lists and category names in sync with Spontaneous Speech,
 * which is served on the same domain and shares the consent cookie.
 */

export const COOKIE_CONTROL_SCRIPT_URL =
  'https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js'

export const COOKIE_CONTROL_PRODUCT = 'PRO_MULTISITE'

type ConsentState = 'granted' | 'denied'

type ConsentParams = Partial<
  Record<
    'ad_storage' | 'analytics_storage' | 'ad_personalization' | 'ad_user_data',
    ConsentState
  >
>

export type OptionalCookieCategory = {
  name: string
  label: string
  description: string
  cookies: string[]
  onAccept: () => void
  onRevoke: () => void
}

export type CookieControlBranding = {
  fontFamily: string
  fontColor: string
  fontSizeTitle: string
  fontSizeHeaders: string
  fontSize: string
  backgroundColor: string
  acceptText: string
  acceptBackground: string
  rejectText: string
  rejectBackground: string
  toggleText: string
  toggleBackground: string
  toggleColor: string
  removeAbout: boolean
}

export type CookieControlConfig = {
  apiKey: string
  product: string
  initialState: 'open' | 'closed' | 'notify' | 'top' | 'box'
  theme: 'light' | 'dark'
  layout: 'slideout' | 'popup'
  position: 'left' | 'right'
  closeStyle: 'icon' | 'labelled' | 'button'
  settingsStyle: 'button' | 'link'
  notifyDismissButton: boolean
  toggleType: 'slider' | 'checkbox'
  logConsent: boolean
  branding: CookieControlBranding
  accessibility: {
    highlightFocus: boolean
    outline: boolean
    overlay: boolean
  }
  necessaryCookies: string[]
  optionalCookies: OptionalCookieCategory[]
}

// Colours from the ICV-76 design (Figma "Cookie Control Banner on
// commonvoice.mozilla.org"). Common Voice has no matching CSS variables yet.
export const BANNER_COLORS = {
  violet: '#4e00d4', // banner and panel background
  gray0: '#ffffff', // text and toggle knob
  gray1000: '#161616', // button background and toggle label
  apricot: '#ff944a', // toggle track
}

export const BRANDING: CookieControlBranding = {
  fontFamily: '"Mozilla Text", "Open Sans", sans-serif',
  fontColor: BANNER_COLORS.gray0,
  fontSizeTitle: '1.125rem', // 18px
  fontSizeHeaders: '1rem', // 16px
  fontSize: '1rem', // 16px
  backgroundColor: BANNER_COLORS.violet,
  acceptText: BANNER_COLORS.gray0,
  acceptBackground: BANNER_COLORS.gray1000,
  rejectText: BANNER_COLORS.gray0,
  rejectBackground: BANNER_COLORS.gray1000,
  toggleText: BANNER_COLORS.gray1000,
  toggleBackground: BANNER_COLORS.apricot,
  toggleColor: BANNER_COLORS.gray0,
  removeAbout: false,
}

// gtag is defined by consent-defaults.js before any Google tag loads.
export function updateGoogleConsent(params: ConsentParams): void {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', params)
  }
}

// Cookies the site needs to work. Civic never deletes these.
// Civic's own consent cookie ("CookieControl") is handled by Civic itself.
export const NECESSARY_COOKIES = [
  // Common Voice
  'mcv_session', // login session (server/src/auth-router.ts)
  'connect.sid', // express-session id used during login
  'mcv_features', // feature flags (FEATURES_COOKIE in common/constants.ts)
  'mcv_dismissed_announcements', // dismissed announcement banners
  // Fundraise Up donation widget, same as foundation.mozilla.org
  'fundraiseup_cid',
  'fundraiseup_func',
  // Stripe, used by the Fundraise Up donation form
  '__stripe_mid',
  '__stripe_sid',
]

export const ANALYTICS_COOKIES = [
  // Google Analytics 4
  '_ga',
  '_ga_*',
  // Legacy Universal Analytics (analytics.js)
  '_gid',
  '_gat',
  '_gat_*',
  '__utma',
  '__utmb',
  '__utmc',
  '__utmt',
  '__utmz',
  // Fundraise Up statistics, same as foundation.mozilla.org
  'fundraiseup_stat',
]

export const MARKETING_COOKIES = [
  // Google Ads conversion linker, set through Google Tag Manager
  '_gcl_au',
  '_gcl_*',
]

// TODO: move label/description into Fluent (.ftl) so they are translated.
export function buildOptionalCookies(): OptionalCookieCategory[] {
  return [
    {
      name: 'analytics',
      label: 'Analytics cookies',
      description:
        'Analytics cookies help us improve Common Voice by collecting and reporting information on how you use it.',
      cookies: ANALYTICS_COOKIES,
      onAccept: () => updateGoogleConsent({ analytics_storage: 'granted' }),
      onRevoke: () => updateGoogleConsent({ analytics_storage: 'denied' }),
    },
    {
      name: 'marketing',
      label: 'Marketing cookies',
      description:
        'Marketing cookies help us measure the effectiveness of our campaigns.',
      cookies: MARKETING_COOKIES,
      onAccept: () =>
        updateGoogleConsent({
          ad_storage: 'granted',
          ad_personalization: 'granted',
          ad_user_data: 'granted',
        }),
      onRevoke: () =>
        updateGoogleConsent({
          ad_storage: 'denied',
          ad_personalization: 'denied',
          ad_user_data: 'denied',
        }),
    },
  ]
}

export function buildCookieControlConfig(apiKey: string): CookieControlConfig {
  return {
    apiKey,
    product: COOKIE_CONTROL_PRODUCT,
    // "notify" shows a bar at the bottom of the page until the visitor chooses.
    initialState: 'notify',
    theme: 'dark',
    // Preference panel slides in from the right, as in the design.
    layout: 'slideout',
    position: 'right',
    closeStyle: 'icon',
    settingsStyle: 'link',
    notifyDismissButton: true,
    toggleType: 'slider',
    logConsent: true,
    branding: BRANDING,
    accessibility: {
      highlightFocus: true,
      outline: true,
      // The page stays usable while the bar is open (no dark overlay).
      overlay: false,
    },
    necessaryCookies: NECESSARY_COOKIES,
    optionalCookies: buildOptionalCookies(),
  }
}
