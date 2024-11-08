import { AllowedSchema } from 'express-json-validator-middleware'

export const GetTranslationsRequest: AllowedSchema = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      enum: ['common-voice', 'spontaneous-speech'],
    },
  },
}
