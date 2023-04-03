import { AllowedSchema } from 'express-json-validator-middleware'

export const CreateReportRequest: AllowedSchema = {
  type: 'object',
  required: ['kind', 'id', 'reasons'],
  properties: {
    kind: {
      type: 'string',
      enum: ['clip', 'sentence', 'pending_sentence']
    },
    id: {
      type: 'string',
    },
    reasons: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
