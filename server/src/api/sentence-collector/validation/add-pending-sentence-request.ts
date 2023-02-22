import { AllowedSchema } from 'express-json-validator-middleware'

export const AddPendingSentenceRequest: AllowedSchema = {
  type: 'object',
  required: ['sentence', 'source', 'localeId', 'localeName'],
  properties: {
    sentence: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    localeId: {
      type: 'integer',
      minimum: 1,
    },
    localeName: {
      type: 'string',
    },
  },
}

export const GetPendingSentencesForReviewRequest: AllowedSchema = {
  type: 'object',
  required: ['localeId'],
  properties: {
    localeId: {
      type: 'integer',
      minimum: 1,
    },
  },
}
