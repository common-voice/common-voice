import getCSPHeaderValue from './csp-header-value';
import { getConfig, injectConfig, CommonVoiceConfig } from './config-helper';

const STORAGE_LOCAL_DEVELOPMENT_ENDPOINT = 'http://localhost:*';

const initialConfig = getConfig();

function resetConfig() {
  injectConfig(initialConfig);
}

function replaceConfig(config: Partial<CommonVoiceConfig>) {
  injectConfig({ ...initialConfig, ...config });
}

describe('getCSPHeaderValue', () => {
  afterEach(() => {
    resetConfig();
  });

  it('should return expected header value for production', () => {
    replaceConfig({ PROD: true, STORAGE_LOCAL_DEVELOPMENT_ENDPOINT });

    const CSP_HEADER_VALUE = getCSPHeaderValue();

    expect(CSP_HEADER_VALUE).not.toContain(STORAGE_LOCAL_DEVELOPMENT_ENDPOINT);
    // we allow unsafe-inline for fundraise up styles - https://fundraiseup.com/support/content-security-policy/
    // expect(CSP_HEADER_VALUE).not.toContain('unsafe');
    expect(CSP_HEADER_VALUE).toBe(
      `default-src 'none';child-src 'self' blob:;style-src 'self' https://fonts.googleapis.com https://tagmanager.google.com 'unsafe-inline';img-src 'self' https://*.google-analytics.com www.gstatic.com https://www.gstatic.com https://*.amazonaws.com https://*.amazon.com https://*.googleapis.com https://gravatar.com https://*.mozilla.org https://*.allizom.org data: https://ssl.gstatic.com https://www.gstatic.com *.fundraiseup.com ucarecdn.com *.paypalobjects.com *.paypal.com;media-src data: blob: https://*.amazonaws.com https://*.amazon.com https://*.googleapis.com;script-src 'self' 'sha256-fIDn5zeMOTMBReM1WNoqqk2MBYTlHZDfCh+vsl1KomQ=' 'sha256-Hul+6x+TsK84TeEjS1fwBMfUYPvUBBsSivv6wIfKY9s=' 'sha256-f5PIEq+yjZ2s4dERSM1INxQKD+3sf+TKU2H7p8iijiI=' 'sha256-GzFSggTMJH0+aLj5HI3ZiCtxjVrlSWczZ/oHezdwRgE=' 'sha256-a4XKOKikGVsTOKjLwsaxxV5wpz/r2aiS5mjhlhYZ6A0=' 'sha256-QpRaNc9WL82cAOkiPfLE1bTAivGUFX9zsApzEurJ9wg=' 'sha256-dWOqg9lnJct6KNFyy8RWWvxwrKvHVzzxWdDufqcgdSY=' 'sha256-b+mf6EIMFYxuAIdk6/2IF09zTUsJrlW6qZaw4opG6QU=' 'sha256-utvmIo/XAKarTSNePyuhOYHs9ViETaxxY7+HaXSd250=' https://*.google-analytics.com https://pontoon.mozilla.org https://*.sentry.io https://tagmanager.google.com *.googletagmanager.com *.fundraiseup.com *.stripe.com m.stripe.network *.paypal.com *.paypalobjects.com pay.google.com  *.src.mastercard.com;font-src 'self' https://fonts.gstatic.com *.fundraiseup.com *.stripe.com https://static.fundraiseup.com/fonts/;connect-src 'self' blob: https://pontoon.mozilla.org/graphql https://*.amazonaws.com https://*.amazon.com https://*.googleapis.com https://www.gstatic.com https://*.google-analytics.com https://*.sentry.io https://basket.mozilla.org https://basket-dev.allizom.org https://rs.fullstory.com https://edge.fullstory.com https://fonts.gstatic.com data: fndrsp.net fndrsp-checkout.net *.fundraiseup.com *.stripe.com *.paypal.com *.paypalobjects.com https://www.google.com/pay https://google.com/pay pay.google.com;frame-src *.fundraiseup.com *.stripe.com *.paypal.com pay.google.com`
    );
  });

  it('should return additional changes for development', () => {
    expect(true).toBeTruthy();
    replaceConfig({ PROD: false, STORAGE_LOCAL_DEVELOPMENT_ENDPOINT });

    const CSP_HEADER_VALUE = getCSPHeaderValue();
    expect(CSP_HEADER_VALUE).toContain(STORAGE_LOCAL_DEVELOPMENT_ENDPOINT);
    expect(CSP_HEADER_VALUE).toContain('unsafe');
  });
});
