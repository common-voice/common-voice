import { AllowedSchema } from 'express-json-validator-middleware';

export const clipsSchema: AllowedSchema = {
  type: 'object',
  properties: {
    count: {
      format: 'positiveIntegerFormat',
      type: 'number',
      minimum: 1,
      maximum: 50
    },
  },
};
