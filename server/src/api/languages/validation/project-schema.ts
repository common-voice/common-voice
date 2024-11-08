import { AllowedSchema } from 'express-json-validator-middleware'

export const projectSchema: AllowedSchema = {
  type: 'object',
  properties: {
    project: {
      type: 'string',
      enum: ['common-voice', 'spontaneous-speech'],
    },
  },
}
