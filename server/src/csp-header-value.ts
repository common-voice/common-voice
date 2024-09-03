import { getConfig } from './config-helper'

const SOURCES = {
  'default-src': ["'none'"],
  'child-src': ["'self'", 'blob:'],
  'style-src': [
    "'self'",
    'https://fonts.googleapis.com',
    'https://tagmanager.google.com',
    // we allow unsafe-inline for fundraise up styles - https://fundraiseup.com/support/content-security-policy/
    "'unsafe-inline'",
  ],
  'img-src': [
    "'self'",
    'https://*.google-analytics.com',
    'www.gstatic.com',
    'https://www.gstatic.com',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
    'https://*.googleapis.com',
    'https://gravatar.com',
    'https://*.mozilla.org',
    'https://*.allizom.org',
    'data:',
    'https://ssl.gstatic.com',
    'https://www.gstatic.com',
    '*.fundraiseup.com',
    'ucarecdn.com',
    '*.paypalobjects.com',
    '*.paypal.com',
  ],
  'media-src': [
    'data:',
    'blob:',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
    'https://*.googleapis.com',
  ],
  'script-src': [
    "'self'",
    "'sha256-fIDn5zeMOTMBReM1WNoqqk2MBYTlHZDfCh+vsl1KomQ='",
    "'sha256-Hul+6x+TsK84TeEjS1fwBMfUYPvUBBsSivv6wIfKY9s='",
    "'sha256-f5PIEq+yjZ2s4dERSM1INxQKD+3sf+TKU2H7p8iijiI='",
    "'sha256-GzFSggTMJH0+aLj5HI3ZiCtxjVrlSWczZ/oHezdwRgE='",
    "'sha256-a4XKOKikGVsTOKjLwsaxxV5wpz/r2aiS5mjhlhYZ6A0='",
    "'sha256-QpRaNc9WL82cAOkiPfLE1bTAivGUFX9zsApzEurJ9wg='",
    "'sha256-dWOqg9lnJct6KNFyy8RWWvxwrKvHVzzxWdDufqcgdSY='",
    "'sha256-b+mf6EIMFYxuAIdk6/2IF09zTUsJrlW6qZaw4opG6QU='",
    "'sha256-utvmIo/XAKarTSNePyuhOYHs9ViETaxxY7+HaXSd250='",
    'https://*.google-analytics.com',
    'https://pontoon.mozilla.org',
    'https://*.sentry.io',
    'https://tagmanager.google.com',
    '*.googletagmanager.com',
    '*.fundraiseup.com',
    '*.stripe.com',
    'm.stripe.network',
    '*.paypal.com',
    '*.paypalobjects.com',
    'pay.google.com ',
    '*.src.mastercard.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    '*.fundraiseup.com',
    '*.stripe.com',
    'https://static.fundraiseup.com/fonts/',
  ],
  'connect-src': [
    "'self'",
    'blob:',
    'https://pontoon.mozilla.org/graphql',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
    'https://*.googleapis.com',
    'https://www.gstatic.com',
    'https://*.google-analytics.com',
    'https://*.sentry.io',
    'https://basket.mozilla.org',
    'https://basket-dev.allizom.org',
    'https://rs.fullstory.com',
    'https://edge.fullstory.com',
    'https://fonts.gstatic.com',
    'data:',
    'fndrsp.net',
    'fndrsp-checkout.net',
    '*.fundraiseup.com',
    '*.stripe.com',
    '*.paypal.com',
    '*.paypalobjects.com',
    'https://www.google.com/pay',
    'https://google.com/pay',
    'pay.google.com',
  ],
  'frame-src': [
    '*.fundraiseup.com',
    '*.stripe.com',
    '*.paypal.com',
    'pay.google.com',
  ],
}

function getCSPHeaderValue() {
  const { PROD } = getConfig()
  const localhostURLs = 'http://localhost:*'

  /*
    default to production mode to make sure we
    don't risk setting development values
    if this function is used incorrectly
  */
  if (!PROD) {
    // we allow unsafe-eval, unsafe-inline locally for certain webpack functionality
    SOURCES['style-src'].push("'unsafe-inline'")
    SOURCES['script-src'].push("'unsafe-eval'")

    // add localhost to allowed sources in development
    SOURCES['connect-src'].push(localhostURLs)
    SOURCES['media-src'].push(localhostURLs)
    SOURCES['img-src'].push(localhostURLs)
  }

  return Object.entries(SOURCES)
    .map(([type, values]) => `${type} ${values.join(' ')}`)
    .join(';')
}

export default getCSPHeaderValue
