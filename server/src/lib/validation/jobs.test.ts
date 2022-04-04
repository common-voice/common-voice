import { Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import validate, { jobSchema } from './index';

describe('Job Schema Validation', () => {
  it('errors when passed incorrect value', () => {
    const request: Partial<Request> = {
      params: {
        jobId: '1a',
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed decimal number', () => {
    const request: Partial<Request> = {
      params: {
        jobId: '1.1',
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed negative number', () => {
    const request: Partial<Request> = {
      params: {
        jobId: '-1',
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed empty string', () => {
    const request: Partial<Request> = {
      params: {
        jobId: '',
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('errors when passed undefined', () => {
    const request: Partial<Request> = {
      params: {
        jobId: undefined,
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('No errors when passed correct value', () => {
    const request: Partial<Request> = {
      params: {
        jobId: '1',
      },
    };
    const response: Partial<Response> = {};
    const next = jest.fn();
    const validationCall = validate({ params: jobSchema });
    validationCall(request as Request, response as Response, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
