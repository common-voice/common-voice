import { AllowedSchema } from 'express-json-validator-middleware'

const clientIdProperty = {
  type: 'string',
  format: 'uuidFormat',
} as const

export const userClientPatchSchema: AllowedSchema = {
  type: 'object',
  properties: {
    // The profile form sends client_id: user.userId, which the web store sets to null once an
    // account exists; accept null so the save isn't 400'd before the handler resolves identity.
    client_id: { type: ['string', 'null'], format: 'uuidFormat' },
  },
}

export const clientIdParamSchema: AllowedSchema = {
  type: 'object',
  required: ['client_id'],
  properties: {
    client_id: clientIdProperty,
  },
}
