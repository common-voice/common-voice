import getCSPHeaderValue from './csp-header-value';
import { getConfig, injectConfig, CommonVoiceConfig } from './config-helper';

const S3_LOCAL_DEVELOPMENT_ENDPOINT = 'http://localhost:9001';

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
    replaceConfig({ PROD: true, S3_LOCAL_DEVELOPMENT_ENDPOINT });

    const CSP_HEADER_VALUE = getCSPHeaderValue();

    expect(CSP_HEADER_VALUE).not.toContain(S3_LOCAL_DEVELOPMENT_ENDPOINT);
    expect(CSP_HEADER_VALUE).not.toContain('unsafe');
    expect(CSP_HEADER_VALUE).toBe(
      `default-src 'none';child-src 'self' blob:;style-src 'self' https://fonts.googleapis.com https://tagmanager.google.com;img-src 'self' www.google-analytics.com www.gstatic.com https://www.gstatic.com https://*.amazonaws.com https://*.amazon.com https://gravatar.com https://*.mozilla.org https://*.allizom.org data: https://ssl.gstatic.com https://www.gstatic.com;media-src data: blob: https://*.amazonaws.com https://*.amazon.com;script-src 'self' 'sha256-fIDn5zeMOTMBReM1WNoqqk2MBYTlHZDfCh+vsl1KomQ=' 'sha256-Hul+6x+TsK84TeEjS1fwBMfUYPvUBBsSivv6wIfKY9s=' 'sha256-f5PIEq+yjZ2s4dERSM1INxQKD+3sf+TKU2H7p8iijiI=' 'sha256-GzFSggTMJH0+aLj5HI3ZiCtxjVrlSWczZ/oHezdwRgE=' https://www.google-analytics.com https://pontoon.mozilla.org https://*.sentry.io https://tagmanager.google.com *.googletagmanager.com;font-src 'self' https://fonts.gstatic.com;connect-src 'self' blob: https://pontoon.mozilla.org/graphql https://*.amazonaws.com https://*.amazon.com https://www.gstatic.com https://www.google-analytics.com https://*.sentry.io https://basket.mozilla.org https://basket-dev.allizom.org https://rs.fullstory.com https://edge.fullstory.com https://fonts.gstatic.com data:`
    );
  });

  it('should return additional changes for development', () => {
    replaceConfig({ PROD: false, S3_LOCAL_DEVELOPMENT_ENDPOINT });

    const CSP_HEADER_VALUE = getCSPHeaderValue();
    expect(CSP_HEADER_VALUE).toContain(S3_LOCAL_DEVELOPMENT_ENDPOINT);
    expect(CSP_HEADER_VALUE).toContain('unsafe');
  });
});
