import { Validator } from 'express-json-validator-middleware';
const formats = {
  positiveIntegerFormat: {
    validate: /^[0-9]*$/,
    type: 'number',
  },
};

const { validate } = new Validator({
  allErrors: true,
  coerceTypes: true,
  formats: formats,
});

export * from './jobs';
export * from './send-language-request';
export * from './sentences';
export * from './datasets';

export default validate;
