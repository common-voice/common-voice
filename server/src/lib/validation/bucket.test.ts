import { Request, Response } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import validate, { bucketParamsSchema } from './index'

describe('Bucket Params Schema Validation', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {}
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const run = () =>
    validate({ params: bucketParamsSchema })(
      mockRequest as Request,
      mockResponse as Response,
      next
    )

  it('passes a valid dataset path', () => {
    mockRequest.params = {
      bucket_type: 'dataset',
      path: 'cv-corpus-8.0-2022-01-19/cv-corpus-8.0-2022-01-19-en.tar.gz',
    }
    run()
    expect(next).toBeCalledWith()
  })

  it('passes a path at exactly 256 characters', () => {
    mockRequest.params = {
      bucket_type: 'dataset',
      path: 'a'.repeat(256),
    }
    run()
    expect(next).toBeCalledWith()
  })

  it('rejects path with leading slash (traversal guard)', () => {
    mockRequest.params = { bucket_type: 'dataset', path: '/etc/passwd' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects path containing .. (directory traversal)', () => {
    mockRequest.params = { bucket_type: 'dataset', path: 'some/../etc/passwd' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects path exceeding 256 characters', () => {
    mockRequest.params = { bucket_type: 'dataset', path: 'a'.repeat(257) }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects path with spaces', () => {
    mockRequest.params = { bucket_type: 'dataset', path: 'path with spaces' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects invalid bucket_type', () => {
    mockRequest.params = { bucket_type: 'clip', path: 'valid/path.tar.gz' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects missing bucket_type', () => {
    mockRequest.params = { path: 'valid/path.tar.gz' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })

  it('rejects missing path', () => {
    mockRequest.params = { bucket_type: 'dataset' }
    run()
    expect(next).toBeCalledWith(expect.any(ValidationError))
  })
})
