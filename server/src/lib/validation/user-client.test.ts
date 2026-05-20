import { Request, Response } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import validate, { userClientPatchSchema, clientIdParamSchema } from './index'

const VALID_UUID = '427a8f51-5708-4ffc-8cce-9724c8747bcb'

describe('user-client schema validation', () => {
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

  describe('userClientPatchSchema (PATCH body)', () => {
    const run = () =>
      validate({ body: userClientPatchSchema })(
        mockRequest as Request,
        mockResponse as Response,
        next
      )

    it('accepts a valid uuid client_id', () => {
      mockRequest.body = { client_id: VALID_UUID, username: 'jane' }
      run()
      expect(next).toBeCalledWith()
    })

    it('accepts null client_id (logged-in profile save)', () => {
      mockRequest.body = { client_id: null, username: 'jane', visible: true }
      run()
      expect(next).toBeCalledWith()
    })

    it('accepts an absent client_id', () => {
      mockRequest.body = { visible: true }
      run()
      expect(next).toBeCalledWith()
    })

    it('rejects a non-uuid client_id string', () => {
      mockRequest.body = { client_id: "not' OR client_id='x" }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })
  })

  describe('clientIdParamSchema (claim param stays strict)', () => {
    const run = () =>
      validate({ params: clientIdParamSchema })(
        mockRequest as Request,
        mockResponse as Response,
        next
      )

    it('accepts a valid uuid param', () => {
      mockRequest.params = { client_id: VALID_UUID }
      run()
      expect(next).toBeCalledWith()
    })

    it('rejects a missing param', () => {
      mockRequest.params = {}
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('rejects a non-uuid param', () => {
      mockRequest.params = { client_id: 'bogus' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })
  })
})
