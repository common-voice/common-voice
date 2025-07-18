import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { getApiCredentialsHandler } from '../../../../api/profile/handler/get-api-credentials-handler'
import { getClientCredentialsQueryHandler } from '../../../../application/profile/query-handler/getClientCredentialsQueryHandler'

// Mock the dependencies
jest.mock('../../../../application/profile/query-handler/getClientCredentialsQueryHandler')

const mockGetClientCredentialsQueryHandler = jest.mocked(getClientCredentialsQueryHandler)

interface MockRequest {
  session: {
    user: {
      client_id?: string
    }
  }
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(obj: object) => MockResponse>
}

describe('getApiCredentialsHandler', () => {
  const createMockRequest = (clientId?: string): MockRequest => ({
    session: {
      user: {
        client_id: clientId,
      },
    },
  })

  const createMockResponse = (): MockResponse => {
    const res = {} as MockResponse
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 when user client_id is missing', async () => {
    const req = createMockRequest(undefined)
    const res = createMockResponse()

    await getApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({ message: 'no client id' })
    expect(mockGetClientCredentialsQueryHandler).not.toHaveBeenCalled()
  })

  it('should return credentials when user client_id exists', async () => {
    const req = createMockRequest('user-123')
    const res = createMockResponse()

    const mockCredentials = [
      { clientId: 'client-123', name: 'Test App 1' },
      { clientId: 'client-456', name: 'Test App 2' },
    ]

    mockGetClientCredentialsQueryHandler.mockResolvedValue(mockCredentials)

    await getApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(res.json).toHaveBeenCalledWith(mockCredentials)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should return empty array when user has no credentials', async () => {
    const req = createMockRequest('user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue([])

    await getApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(res.json).toHaveBeenCalledWith([])
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should handle errors from getClientCredentialsQueryHandler', async () => {
    const req = createMockRequest('user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockRejectedValue(new Error('Failed to retrieve client credentials: 500'))

    await expect(getApiCredentialsHandler(req as unknown as Request, res as unknown as Response)).rejects.toThrow('Failed to retrieve client credentials: 500')
    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })
})
