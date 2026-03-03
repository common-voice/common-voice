import { AllowedSchema } from 'express-json-validator-middleware'

export const sendContactRequestSchema: AllowedSchema = {
  type: 'object',
  required: ['email', 'message'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    name: {
      type: 'string',
    },
    message: {
      type: 'string',
      minLength: 1,
    },
  },
}
