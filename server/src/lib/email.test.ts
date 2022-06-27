import * as nodemailer from 'nodemailer';
import * as AWS from '@aws-sdk/client-ses';

import { CommonVoiceConfig, getConfig, injectConfig } from '../config-helper';
import Email from './email';

jest.mock('@aws-sdk/client-ses');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockNodemailer = nodemailer as jest.MockedFunction<any>;
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
  createTestAccount: jest.fn(() => {
    return Promise.resolve({
      user: 'cool-username',
      pass: 'fake-password',
    });
  }),
  getTestMessageUrl: jest.fn(() => 'http://example.com'),
}));

const initialConfig = getConfig();

function resetConfig() {
  injectConfig(initialConfig);
}

function replaceConfig(config: Partial<CommonVoiceConfig>) {
  injectConfig({ ...initialConfig, ...config });
}

const MOCK_CONFIG = {
  EMAIL_USERNAME_FROM: 'commonvoice+test-from@example.com',
  EMAIL_USERNAME_TO: 'commonvoice+test-to@example.com',
  AWS_SES_CONFIG: {
    credentials: {
      accessKeyId: 'fake-access-key-id',
      secretAccessKey: 'fake-secret-access-key',
    },
  },
};

describe('Email', () => {
  const mockTransport = {
    isIdle: jest.fn(() => true),
    sendMail: jest.fn(() => ({})),
    once: jest.fn(() => null),
  };

  beforeAll(() => {
    mockNodemailer.createTransport.mockImplementation(() => mockTransport);
  });

  afterEach(() => {
    resetConfig();
  });

  describe('is production', () => {
    let email: Email;

    beforeEach(() => {
      replaceConfig({
        ...MOCK_CONFIG,
        PROD: true,
      });
      email = new Email();
    });

    it('calls AWS correctly', async () => {
      expect(AWS.SES).toBeCalledWith({
        apiVersion: '2010-12-01',
        region: 'us-west-2',
        credentials: {
          accessKeyId: 'fake-access-key-id',
          secretAccessKey: 'fake-secret-access-key',
        },
      });
      // called with object for aws
      expect(
        Object.keys(mockNodemailer.createTransport.mock.calls[0][0])
      ).toEqual(['SES', 'sendingRate']);
    });

    describe('sendLanguageRequestEmail', () => {
      afterEach(() => {
        mockTransport.isIdle.mockClear();
        mockTransport.sendMail.mockClear();
      });

      it('calls nodemailer correctly', async () => {
        await email.sendLanguageRequestEmail({
          email: 'test@example.com',
          languageInfo:
            "I'd love for JavaScript to be supported on CommonVoice",
          languageLocale: 'en-US',
        });

        expect(mockTransport.isIdle).toBeCalled();
        expect(mockTransport.sendMail).toBeCalledWith({
          from: 'commonvoice+test-from@example.com',
          to: 'commonvoice+test-to@example.com',
          subject: 'Language Request test@example.com en-US',
          html: `
      <h2>Email</h2>
      <p><a href="mailto:test@example.com">test@example.com</a></p>
      <h2>Language Information</h2>
      <p>I'd love for JavaScript to be supported on CommonVoice</p><h2>Language Locale</h2>
        <p>en-US</p>
      `.trim(),
        });

        // no test preview urls in production
        expect(mockNodemailer.getTestMessageUrl).not.toBeCalled();
      });

      it('handles missing language locale', async () => {
        await email.sendLanguageRequestEmail({
          email: 'test@example.com',
          languageInfo:
            "No languages for me, just want to say you're doing a great job!",
        });

        expect(mockTransport.sendMail).toBeCalledWith({
          from: 'commonvoice+test-from@example.com',
          to: 'commonvoice+test-to@example.com',
          subject: 'Language Request test@example.com',
          html: `
      <h2>Email</h2>
      <p><a href="mailto:test@example.com">test@example.com</a></p>
      <h2>Language Information</h2>
      <p>No languages for me, just want to say you're doing a great job!</p>
      `.trim(),
        });
      });
    });
  });

  describe('is not production', () => {
    let email: Email;

    beforeEach(() => {
      replaceConfig({
        ...MOCK_CONFIG,
        PROD: false,
      });
      email = new Email();
    });

    it('creates a test account', async () => {
      expect(mockNodemailer.createTestAccount).toBeCalledTimes(1);
      expect(mockNodemailer.createTransport).toBeCalledWith({
        auth: {
          pass: 'fake-password',
          user: 'cool-username',
        },
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
      });
    });

    describe('sendLanguageRequestEmail', () => {
      afterEach(() => {
        mockTransport.isIdle.mockClear();
        mockTransport.sendMail.mockClear();
      });

      it('calls nodemailer correctly', async () => {
        await email.sendLanguageRequestEmail({
          email: 'test@example.com',
          languageInfo:
            "I'd love for JavaScript to be supported on CommonVoice",
          languageLocale: 'en-US',
        });

        expect(mockTransport.isIdle).not.toBeCalled();
        expect(mockTransport.sendMail).toBeCalled();

        // test preview urls in non-production
        expect(mockNodemailer.getTestMessageUrl).toBeCalledTimes(1);
      });
    });
  });
});
