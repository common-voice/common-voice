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

    it('accepts valid gender values', () => {
      for (const gender of [
        'female_feminine',
        'male_masculine',
        'intersex',
        'transgender',
        'non-binary',
        'do_not_wish_to_say',
        '',
      ]) {
        next.mockClear()
        mockRequest.body = { gender }
        run()
        expect(next).toBeCalledWith()
      }
    })

    it('rejects invalid gender (attack pattern)', () => {
      mockRequest.body = { gender: 'hittsiiqeaqpg.blid.site' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('rejects arbitrary string gender', () => {
      mockRequest.body = { gender: 'male' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('accepts valid age values', () => {
      for (const age of ['teens', 'twenties', 'thirties', 'nineties', '']) {
        next.mockClear()
        mockRequest.body = { age }
        run()
        expect(next).toBeCalledWith()
      }
    })

    it('rejects invalid age', () => {
      mockRequest.body = { age: 'old' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('rejects unknown fields', () => {
      mockRequest.body = { unknownField: 'value' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('accepts full valid profile body', () => {
      mockRequest.body = {
        client_id: VALID_UUID,
        username: 'jane',
        visible: 0,
        age: 'thirties',
        gender: 'female_feminine',
        languages: [],
        enrollment: { challenge: null, invite: null, team: null },
        skip_submission_feedback: false,
      }
      run()
      expect(next).toBeCalledWith()
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
