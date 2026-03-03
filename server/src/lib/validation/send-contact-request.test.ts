import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import validate, { sendContactRequestSchema } from './index'

describe('sendContactRequestSchema validation', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = { json: jest.fn() }
    nextFunction = jest.fn()
  })

  const runValidation = (body: unknown) => {
    mockRequest.body = body
    validate({ body: sendContactRequestSchema })(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
  }

  it('passes with email and message', () => {
    runValidation({ email: 'user@example.com', message: 'Hello!' })
    expect(nextFunction).toHaveBeenCalledWith()
  })

  it('passes with optional name included', () => {
    runValidation({ email: 'user@example.com', name: 'Alice', message: 'Hi' })
    expect(nextFunction).toHaveBeenCalledWith()
  })

  it('fails when email is missing', () => {
    runValidation({ message: 'Hello!' })
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError))
  })

  it('fails when message is missing', () => {
    runValidation({ email: 'user@example.com' })
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError))
  })

  it('fails when email is not a valid email address', () => {
    runValidation({ email: 'not-an-email', message: 'Hello!' })
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError))
  })

  it('fails when message is empty string', () => {
    runValidation({ email: 'user@example.com', message: '' })
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError))
  })
})
