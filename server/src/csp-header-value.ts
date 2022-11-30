import { getConfig } from './config-helper';

const SOURCES = {
  'default-src': ["'none'"],
  'child-src': ["'self'", 'blob:'],
  'style-src': [
    "'self'",
    'https://fonts.googleapis.com',
    'https://tagmanager.google.com',
  ],
  'img-src': [
    "'self'",
    'www.google-analytics.com',
    'www.gstatic.com',
    'https://www.gstatic.com',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
    'https://gravatar.com',
    'https://*.mozilla.org',
    'https://*.allizom.org',
    'data:',
    'https://ssl.gstatic.com',
    'https://www.gstatic.com',
  ],
  'media-src': [
    'data:',
    'blob:',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
  ],
  'script-src': [
    "'self'",
    "'sha256-fIDn5zeMOTMBReM1WNoqqk2MBYTlHZDfCh+vsl1KomQ='",
    "'sha256-Hul+6x+TsK84TeEjS1fwBMfUYPvUBBsSivv6wIfKY9s='",
    "'sha256-f5PIEq+yjZ2s4dERSM1INxQKD+3sf+TKU2H7p8iijiI='",
    "'sha256-GzFSggTMJH0+aLj5HI3ZiCtxjVrlSWczZ/oHezdwRgE='",
    "'sha256-a4XKOKikGVsTOKjLwsaxxV5wpz/r2aiS5mjhlhYZ6A0='",
    'https://www.google-analytics.com',
    'https://pontoon.mozilla.org',
    'https://*.sentry.io',
    'https://tagmanager.google.com',
    '*.googletagmanager.com',
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'blob:',
    'https://pontoon.mozilla.org/graphql',
    'https://*.amazonaws.com',
    'https://*.amazon.com',
    'https://www.gstatic.com',
    'https://www.google-analytics.com',
    'https://*.sentry.io',
    'https://basket.mozilla.org',
    'https://basket-dev.allizom.org',
    'https://rs.fullstory.com',
    'https://edge.fullstory.com',
    'https://fonts.gstatic.com',
    'data:',
  ],
};

function getCSPHeaderValue() {
  const { PROD, S3_LOCAL_DEVELOPMENT_ENDPOINT } = getConfig();

  /*
    default to production mode to make sure we
    don't risk setting development values
    if this function is used incorrectly
  */
  if (!PROD) {
    // we allow unsafe-eval, unsafe-inline locally for certain webpack functionality
    SOURCES['style-src'].push("'unsafe-inline'");
    SOURCES['script-src'].push("'unsafe-eval'");

    // add s3proxy to allowed sources in development
    SOURCES['connect-src'].push(S3_LOCAL_DEVELOPMENT_ENDPOINT);
    SOURCES['media-src'].push(S3_LOCAL_DEVELOPMENT_ENDPOINT);
    SOURCES['img-src'].push(S3_LOCAL_DEVELOPMENT_ENDPOINT);
  }

  return Object.entries(SOURCES)
    .map(([type, values]) => `${type} ${values.join(' ')}`)
    .join(';');
}

export default getCSPHeaderValue;
