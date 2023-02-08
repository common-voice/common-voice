import { AllowedSchema } from 'express-json-validator-middleware';

export const sendLanguageRequestSchema: AllowedSchema = {
  type: 'object',
  required: ['email', 'languageInfo'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    languageInfo: {
      type: 'string',
    },
    languageLocale: {
      type: 'string',
    },
  },
};
