import { Validator } from 'express-json-validator-middleware';
const formats = {
  positiveIntegerFormat: {
    validate: /^[0-9]*$/,
    type: 'number',
  },
  uuidFormat: {
    validate: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    type: 'string',
  },
};

const { validate } = new Validator({
  allErrors: true,
  coerceTypes: true,
  formats: formats,
});

export const validateStrict = new Validator({
  allErrors: true,
  formats: formats,
}).validate;

export * from './jobs';
export * from './send-language-request';
export * from './send-contact-request';
export * from './sentences';
export * from './datasets';
export * from './statistics';
export * from './clips';
export * from './languages';
export * from './user-client';

export default validate;
