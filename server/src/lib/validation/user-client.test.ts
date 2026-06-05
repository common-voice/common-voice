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
      mockRequest.body = { client_id: null, username: 'jane', visible: 1 }
      run()
      expect(next).toBeCalledWith()
    })

    it('accepts an absent client_id', () => {
      mockRequest.body = { visible: 1 }
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

    it('accepts visible 0, 1, 2', () => {
      for (const visible of [0, 1, 2]) {
        next.mockClear()
        mockRequest.body = { visible }
        run()
        expect(next).toBeCalledWith()
      }
    })

    it('rejects visible out of range', () => {
      for (const visible of [-1, 3, 1.5]) {
        next.mockClear()
        mockRequest.body = { visible }
        run()
        expect(next).toBeCalledWith(expect.any(ValidationError))
      }
    })

    it('rejects empty username', () => {
      mockRequest.body = { username: '' }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('accepts enrollment: null', () => {
      mockRequest.body = { enrollment: null }
      run()
      expect(next).toBeCalledWith()
    })

    it('rejects languages with non-object items', () => {
      mockRequest.body = { languages: [1, 'x'] }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('rejects languages where accents is not an array', () => {
      mockRequest.body = { languages: [{ locale: 'en', accents: 'not-an-array' }] }
      run()
      expect(next).toBeCalledWith(expect.any(ValidationError))
    })

    it('accepts a non-empty languages array with valid structure', () => {
      mockRequest.body = {
        languages: [{ locale: 'en', accents: [{ id: 1, name: 'General American' }] }],
      }
      run()
      expect(next).toBeCalledWith()
    })

    it('accepts full valid profile body', () => {
      mockRequest.body = {
        client_id: VALID_UUID,
        username: 'jane',
        visible: 0,
        age: 'thirties',
        gender: 'female_feminine',
        languages: [{ locale: 'en', accents: [{ id: 1, name: 'General American' }] }],
        enrollment: { challenge: 'pilot', team: 'mozilla' },
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
