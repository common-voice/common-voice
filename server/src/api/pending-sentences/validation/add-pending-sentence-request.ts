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

export const AddPendingSentenceVoteRequest: AllowedSchema = {
  type: 'object',
  required: ['pending_sentence_id', 'is_valid'],
  properties: {
    pending_sentence_id: {
      type: 'integer',
      minimum: 1,
    },
    is_valid: {
      type: 'boolean',
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
