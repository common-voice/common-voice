import { AllowedSchema } from 'express-json-validator-middleware'

const clientIdProperty = {
  type: 'string',
  format: 'uuidFormat',
} as const

export const userClientPatchSchema: AllowedSchema = {
  type: 'object',
  properties: {
    client_id: clientIdProperty,
  },
}

export const clientIdParamSchema: AllowedSchema = {
  type: 'object',
  required: ['client_id'],
  properties: {
    client_id: clientIdProperty,
  },
}
