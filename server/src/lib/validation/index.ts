import { Validator } from 'express-json-validator-middleware';

const { validate } = new Validator({ allErrors: true });

export * from './jobs';
export default validate;
