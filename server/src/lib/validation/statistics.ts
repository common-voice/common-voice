import { AllowedSchema } from 'express-json-validator-middleware';
import { JSONSchema4 } from 'json-schema';

const yearStatSchema: {
  [k: string]: JSONSchema4
} = {
  year: {
    type: 'number',
    minimum: 2016,
    maximum: 2035
  },
};

export const downloadStatSchema: AllowedSchema = {
  type: 'object',
  properties: {
    ...yearStatSchema
  },
};

export const speakerStatSchema: AllowedSchema = {
  type: 'object',
  properties: {
    ...yearStatSchema
  },
};

export const accountStatSchema: AllowedSchema = {
  type: 'object',
  properties: {
    ...yearStatSchema
  },
};

export const clipStatSchema: AllowedSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['rejected'],
    },
    ...yearStatSchema
  },
};

export const sentenceStatSchema: AllowedSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['duplicate'],
    },
    ...yearStatSchema
  },
};
