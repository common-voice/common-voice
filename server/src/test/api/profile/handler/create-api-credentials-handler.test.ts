import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { getClientCredentialsQueryHandler } from '../../../../application/profile/query-handler/getClientCredentialsQueryHandler'
import { createClientCredentialsCommandHandler } from '../../../../application/profile/command-handler/createClientCredentialsCommandHandler'
import { createApiCredentialsHandler } from '../../../../api/profile/handler/create-api-credentials-handler'

// Mock the dependencies
jest.mock(
  '../../../../application/profile/query-handler/getClientCredentialsQueryHandler'
)
jest.mock(
  '../../../../application/profile/command-handler/createClientCredentialsCommandHandler'
)

const mockGetClientCredentialsQueryHandler = jest.mocked(getClientCredentialsQueryHandler)
const mockCreateClientCredentialsCommandHandler = jest.mocked(createClientCredentialsCommandHandler)

interface MockRequest {
  session: {
    user: {
      client_id?: string
    }
  }
  body: {
    description: string
  }
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(obj: object) => MockResponse>
  end: jest.MockedFunction<() => MockResponse>
}

describe('createApiCredentialsHandler', () => {
  const createMockRequest = (userId: string, desc: string): MockRequest => ({
    session: {
      user: {
        client_id: userId,
      },
    },
    body: {
      description: desc,
    },
  })

  const createMockResponse = (): MockResponse => {
    const res = {} as MockResponse
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.end = jest.fn().mockReturnValue(res)
    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 when user client_id is missing', async () => {
    const req = createMockRequest(undefined, 'Test desc')
    const res = createMockResponse()

    await createApiCredentialsHandler(
      req as unknown as Request,
      res as unknown as Response
    )

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({ message: 'no user client id' })
  })

  it('should create credentials if user has less than 10 api credentials', async () => {
    const req = createMockRequest('user-123', 'Test desc')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue(
      Array(9).fill({ clientId: 'client-456' })
    )

    await createApiCredentialsHandler(
      req as unknown as Request,
      res as unknown as Response
    )

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(mockCreateClientCredentialsCommandHandler).toHaveBeenCalledWith({
      userId: 'user-123',
      description: 'Test desc',
    })
  })

  it('should not create credentials if user has 10 or more api credentials already', async () => {
    const req = createMockRequest('user-123', 'Test desc')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue(
      Array(10).fill({ clientId: 'client-x' })
    )

    await createApiCredentialsHandler(
      req as unknown as Request,
      res as unknown as Response
    )

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(mockCreateClientCredentialsCommandHandler).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({ message: 'too many credentials' })
  })
})
