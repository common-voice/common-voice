import { AllowedSchema } from 'express-json-validator-middleware';

export const datasetSchema: AllowedSchema = {
  type: 'object',
  properties: {
    releaseType: {
      type: 'string',
      enum: ['delta', 'complete', 'singleword'],
    },
  },
};
