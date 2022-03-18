import { AllowedSchema } from 'express-json-validator-middleware';
const STRING_DIGIT = '^[0-9]+$';

export const jobSchema: AllowedSchema = {
  type: 'object',
  required: ['jobId'],
  properties: {
    jobId: {
      type: 'string',
      maxLength: 10,
      minLength: 1,
      pattern: STRING_DIGIT,
    },
  },
};
