import { ValidationError, Validator } from 'express-json-validator-middleware';
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
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed decimal number', () => {
    const req: any = {
      params: {
        jobId: '1.1',
      },
    };
    const res: any = {};
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed negative number', () => {
    const req: any = {
      params: {
        jobId: '-1',
      },
    };
    const res: any = {};
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed empty string', () => {
    const req: any = {
      params: {
        jobId: '',
      },
    };
    const res: any = {};
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed undefined', () => {
    const req: any = {
      params: {
        jobId: undefined,
      },
    };
    const res: any = {};
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('No errors when passed correct value', () => {
    const req: any = {
      params: {
        jobId: '1',
      },
    };
    const res: any = {};
    const next = jest.fn();
    jobValidate(req, res, next);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
