import { AllowedSchema } from 'express-json-validator-middleware'
import { Gender } from 'common'

const clientIdProperty = {
  type: 'string',
  format: 'uuidFormat',
} as const

// Keys mirror the Gender type in common/user-clients.ts and the genders DB table.
// AGES has no equivalent type in common yet; keep in sync with web/src/stores/demographics.ts.
const GENDER_VALUES: Array<keyof Gender | ''> = [
  'female_feminine',
  'male_masculine',
  'intersex',
  'transgender',
  'non-binary',
  'do_not_wish_to_say',
  '',
]

const AGE_VALUES = [
  'teens',
  'twenties',
  'thirties',
  'fourties',
  'fifties',
  'sixties',
  'seventies',
  'eighties',
  'nineties',
  '',
] as const

export const userClientPatchSchema: AllowedSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    // The profile form sends client_id: user.userId, which the web store sets to null once an
    // account exists; accept null so the save isn't 400'd before the handler resolves identity.
    client_id: { type: ['string', 'null'], format: 'uuidFormat' },
    username: { type: 'string', maxLength: 255 },
    visible: { type: ['number', 'boolean', 'integer'] },
    age: { type: 'string', enum: AGE_VALUES as unknown as string[] },
    gender: { type: 'string', enum: GENDER_VALUES as unknown as string[] },
    skip_submission_feedback: { type: 'boolean' },
    languages: { type: 'array' },
    enrollment: { type: 'object' },
  },
}

export const clientIdParamSchema: AllowedSchema = {
  type: 'object',
  required: ['client_id'],
  properties: {
    client_id: clientIdProperty,
  },
}
