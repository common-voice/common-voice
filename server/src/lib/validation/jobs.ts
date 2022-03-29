import { AllowedSchema } from 'express-json-validator-middleware';

export const jobSchema: AllowedSchema = {
  type: 'object',
  required: ['jobId'],
  properties: {
    jobId: {
      format: 'positiveIntegerFormat',
      type: 'number',
      minimum: 1,
    },
  },
};
