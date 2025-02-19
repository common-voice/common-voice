import { AllowedSchema } from 'express-json-validator-middleware'

export const sendLanguageRequestSchema: AllowedSchema = {
  type: 'object',
  required: ['email', 'languageInfo', 'platforms'],
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
    platforms: {
      type: 'array',
      items: {
        enum: ['scripted-speech', 'spontaneous-speech'],
      },
    },
  },
}
