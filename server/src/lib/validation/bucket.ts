import { AllowedSchema } from 'express-json-validator-middleware'

export const bucketParamsSchema: AllowedSchema = {
  type: 'object',
  required: ['bucket_type', 'path'],
  properties: {
    bucket_type: {
      type: 'string',
      enum: ['dataset'],
    },
    path: {
      type: 'string',
      maxLength: 256,
      // req.params is already URL-decoded; pattern blocks leading '/' and any '..'.
      pattern: '^(?!/)(?!.*\\.\\.)[A-Za-z0-9._\\-/]+$',
    },
  },
}
