import { AllowedSchema } from 'express-json-validator-middleware'

export const CreateApiCredentialsRequest: AllowedSchema = {
  type: 'object',
  required: ['description'],
  properties: {
    description: {
      type: 'string',
      maxLength: 255,
    },
  },
}
