import fetch, { Response } from 'node-fetch';
import Logger from './logger';

import GoogleReCAPTCHA from './google-recaptcha';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockLogger = Logger as jest.MockedFunction<any>;
jest.mock('./logger');

const mockSuccessResponse = Promise.resolve({
  success: true,
  score: 0.8,
  challenge_ts: 'something',
  hostname: 'http://example.com',
});
const mockLowScoreSuccessResponse = Promise.resolve({
  success: true,
  score: 0.1,
  challenge_ts: 'something',
  hostname: 'http://example.com',
});
const mockErrorResponse = Promise.resolve({
  success: false,
  'error-codes': ['invalid-input-secret'],
});
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
jest.mock('node-fetch');

jest.mock('../config-helper', () => ({
  getConfig: () => ({
    PROD: true,
    GOOGLE_RECAPTCHA_SECRET_KEY: 'GOOGLE_RECAPTCHA_SECRET_KEY',
  }),
}));

describe('GoogleReCAPTCHA', () => {
  let googleReCAPTCHA: GoogleReCAPTCHA;

  describe('verify', () => {
    describe('successful google response', () => {
      beforeEach(() => {
        googleReCAPTCHA = new GoogleReCAPTCHA();
        const json = jest.fn() as jest.MockedFunction<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        json.mockResolvedValue(mockSuccessResponse);
        mockFetch.mockResolvedValue({ ok: true, json } as Response);
      });

      afterEach(() => {
        mockFetch.mockClear();
      });

      it('returns false if no response sent', async () => {
        const result = await googleReCAPTCHA.verify(null);
        expect(result).toBe(false);
      });

      it('sends a correct POST request to Google', async () => {
        const mockReCAPTCHAClientResponse = 'fake-client-response';
        await googleReCAPTCHA.verify(mockReCAPTCHAClientResponse);

        const expectedURL = new URL(
          'https://www.google.com/recaptcha/api/siteverify?secret=GOOGLE_RECAPTCHA_SECRET_KEY&response=fake-client-response'
        );
        expect(mockFetch.mock.calls.length).toBe(1);
        expect(mockFetch).toBeCalledWith(expectedURL, { method: 'POST' });
      });

      it('returns true', async () => {
        const mockReCAPTCHAClientResponse = 'fake-client-response';
        const result = await googleReCAPTCHA.verify(
          mockReCAPTCHAClientResponse
        );
        expect(result).toBe(true);
      });
    });

    describe('low score response', () => {
      beforeEach(() => {
        googleReCAPTCHA = new GoogleReCAPTCHA();
        const json = jest.fn() as jest.MockedFunction<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        json.mockResolvedValue(mockLowScoreSuccessResponse);
        mockFetch.mockResolvedValue({ ok: true, json } as Response);
      });

      afterEach(() => {
        mockFetch.mockClear();
      });

      it('returns false', async () => {
        const mockReCAPTCHAClientResponse = 'fake-client-response';
        const result = await googleReCAPTCHA.verify(
          mockReCAPTCHAClientResponse
        );
        expect(result).toBe(false);
      });
    });

    describe('error google response', () => {
      beforeEach(() => {
        googleReCAPTCHA = new GoogleReCAPTCHA();
        const json = jest.fn() as jest.MockedFunction<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        json.mockResolvedValue(mockErrorResponse);
        mockFetch.mockResolvedValue({ ok: true, json } as Response);
      });

      afterEach(() => {
        mockFetch.mockClear();
        mockLogger.mockClear();
      });

      it('calls our logger with errors', async () => {
        const mockReCAPTCHAClientResponse = 'fake-client-response';
        await googleReCAPTCHA.verify(mockReCAPTCHAClientResponse);

        const mockLoggerInstance = mockLogger.mock.instances[0];
        const mockLoggerError = mockLoggerInstance.error;
        expect(mockLoggerError).toHaveBeenCalledWith(
          ['invalid-input-secret'],
          'https://developers.google.com/recaptcha/docs/verify#error_code_reference'
        );
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
      });

      it('returns false', async () => {
        const mockReCAPTCHAClientResponse = 'fake-client-response';
        const result = await googleReCAPTCHA.verify(
          mockReCAPTCHAClientResponse
        );
        expect(result).toBe(false);
      });
    });
  });
});
