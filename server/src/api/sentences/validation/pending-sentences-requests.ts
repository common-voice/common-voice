import { AllowedSchema } from 'express-json-validator-middleware'
import { sentenceDomains } from 'common'

export const AddSentenceRequest: AllowedSchema = {
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
    domains: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...sentenceDomains],
      },
      uniqueItems: true,
    },
  },
}

export const AddSentenceVoteRequest: AllowedSchema = {
  type: 'object',
  required: ['sentence_id', 'vote'],
  properties: {
    sentence_id: {
      type: 'string',
    },
    vote: {
      type: 'boolean',
    },
  },
}

export const GetSentencesForReviewRequest: AllowedSchema = {
  type: 'object',
  required: ['localeId'],
  properties: {
    localeId: {
      type: 'integer',
      minimum: 1,
    },
  },
}
