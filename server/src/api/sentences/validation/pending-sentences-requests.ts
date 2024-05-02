import { AllowedSchema } from 'express-json-validator-middleware'
import { sentenceDomains } from 'common'

export const AddSentenceRequest: AllowedSchema = {
  type: 'object',
  required: ['sentence', 'source', 'localeName', 'domains'],
  properties: {
    sentence: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    localeName: {
      type: 'string',
    },
    domains: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'string',
        enum: [...sentenceDomains],
      },
      uniqueItems: true,
    },
    variant: {
      type: 'string',
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
