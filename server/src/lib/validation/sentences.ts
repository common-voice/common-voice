import { AllowedSchema } from 'express-json-validator-middleware';

export const sentenceSchema: AllowedSchema = {
  type: 'object',
  required: ['count'],
  properties: {
    count: {
      format: 'positiveIntegerFormat',
      type: 'number',
      minimum: 1,
      maximum: 50,
    },
  },
};
