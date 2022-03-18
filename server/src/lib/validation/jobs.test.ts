import { Validator } from 'express-json-validator-middleware';
import { jobSchema } from './index';

describe('Job Schema Validation', () => {
  const jobValidate = new Validator({ allErrors: true }).validate({
    params: jobSchema,
  });

  it('errors when passed incorrect value', () => {
    const req: any = {
      params: {
        jobId: '1a',
      },
    };
    const res: any = {};

    jobValidate(req, res, (error: any) => {
      expect(error.name).toBe('JsonSchemaValidationError');
    });
  });
});
