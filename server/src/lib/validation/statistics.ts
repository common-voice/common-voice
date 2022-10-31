import { AllowedSchema } from 'express-json-validator-middleware';

export const clipStatScehma: AllowedSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['rejected'],
    },
  },
};

export const sentenceStatScehma: AllowedSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['duplicate'],
    },
  },
};
