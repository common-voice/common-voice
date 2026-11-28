/*
 * Google Consent Mode v2 defaults.
 *
 * Loaded as a blocking script in index_template.html BEFORE Google Tag Manager
 * and gtag.js so that every Google tag starts with all storage denied. Nothing
 * may set analytics or advertising cookies until the visitor makes a choice in
 * the cookie consent banner, which then calls gtag('consent', 'update', ...).
 *
 * This is a plain same-origin file (not an inline <script>) so it is allowed by
 * the 'self' source in the Content Security Policy and needs no sha256 hash.
 *
 * https://developers.google.com/tag-platform/security/guides/consent
 */
window.dataLayer = window.dataLayer || []

// gtag must push the `arguments` object itself (not an array copy): Google's
// tags only recognise commands pushed in that form.
// eslint-disable-next-line prefer-rest-params
window.gtag = function gtag() {
  window.dataLayer.push(arguments)
}

window.gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_personalization: 'denied',
  ad_user_data: 'denied',
})
