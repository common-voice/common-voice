import { AllowedSchema } from 'express-json-validator-middleware'

export const GetApiCredentialsRequest: AllowedSchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
    },
  },
}
