import { AllowedSchema } from 'express-json-validator-middleware';

export const sentenceSchema: AllowedSchema = {
  type: 'object',
  required: ['count'],
  properties: {
    count: {
      type: 'number',
      minimum: 1,
      maximum: 50,
    },
  },
};
