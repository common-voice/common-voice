import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import validate, { randomClipsCountSchema } from './index';

describe('Random Clips Count Validation', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should be invalid when the count is greater than 50', () => {
        const validation = validate({ query: randomClipsCountSchema });
        mockRequest.query = {
            count: '99',
        };

        validation(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toBeCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should be invalid when the count is less than 1', () => {
        const validation = validate({ query: randomClipsCountSchema });
        mockRequest.query = {
            count: '-1',
        };

        validation(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toBeCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should be invalid when the count is not a number', () => {
        const validation = validate({ query: randomClipsCountSchema });
        mockRequest.query = {
            count: 'abc',
        };

        validation(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toBeCalledTimes(1);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should be valid when count is not set ', () => {
        mockRequest.query = {};
        const validation = validate({ query: randomClipsCountSchema });

        validation(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith();
    });
});