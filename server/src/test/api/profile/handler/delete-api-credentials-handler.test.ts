import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { deleteApiCredentialsHandler } from '../../../../api/profile/handler/delete-api-credentials-handler'
import { getClientCredentialsQueryHandler } from '../../../../application/profile/query-handler/getClientCredentialsQueryHandler'
import { deleteClientCredentialsCommandHandler } from '../../../../application/profile/command-handler/deleteClientCredentialsCommandHandler'

// Mock the dependencies
jest.mock('../../../../application/profile/query-handler/getClientCredentialsQueryHandler')
jest.mock('../../../../application/profile/command-handler/deleteClientCredentialsCommandHandler')

const mockGetClientCredentialsQueryHandler = jest.mocked(getClientCredentialsQueryHandler)
const mockDeleteClientCredentialsCommandHandler = jest.mocked(deleteClientCredentialsCommandHandler)

interface MockRequest {
  session: {
    user: {
      client_id?: string
    }
  }
  params: {
    client_id?: string
  }
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(obj: object) => MockResponse>
  end: jest.MockedFunction<() => MockResponse>
}

describe('deleteApiCredentialsHandler', () => {
  const createMockRequest = (clientId: string, userId?: string): MockRequest => ({
    session: {
      user: {
        client_id: userId,
      },
    },
    params: {
      client_id: clientId,
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
    const req = createMockRequest('client-123', undefined)
    const res = createMockResponse()

    await deleteApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({ message: 'no user client id' })
  })


  it('should return 204 when client_id does not belong to user', async () => {
    const req = createMockRequest('client-123', 'user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue([
      { clientId: 'client-456' },
      { clientId: 'client-789' },
    ])

    await deleteApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    expect(res.end).toHaveBeenCalled()
    expect(mockDeleteClientCredentialsCommandHandler).not.toHaveBeenCalled()
  })

  it('should successfully delete client credentials and return 204', async () => {
    const req = createMockRequest('client-456', 'user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue([
      { clientId: 'client-123' },
      { clientId: 'client-456' },
      { clientId: 'client-789' },
    ])

    await deleteApiCredentialsHandler(req as unknown as Request, res as unknown as Response)

    expect(mockGetClientCredentialsQueryHandler).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(mockDeleteClientCredentialsCommandHandler).toHaveBeenCalledWith({
      clientId: 'client-456',
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    expect(res.end).toHaveBeenCalled()
  })

  it('should handle errors from getClientCredentialsQueryHandler', async () => {
    const req = createMockRequest('client-123', 'user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockRejectedValue(new Error('Failed to retrieve client credentials'))

    await expect(deleteApiCredentialsHandler(req as unknown as Request, res as unknown as Response)).rejects.toThrow('Failed to retrieve client credentials')
    expect(mockDeleteClientCredentialsCommandHandler).not.toHaveBeenCalled()
  })

  it('should handle errors from deleteClientCredentialsCommandHandler', async () => {
    const req = createMockRequest('client-456', 'user-123')
    const res = createMockResponse()

    mockGetClientCredentialsQueryHandler.mockResolvedValue([
      { clientId: 'client-456' },
    ])
    mockDeleteClientCredentialsCommandHandler.mockRejectedValue(new Error('Failed to delete client credentials: 500'))

    await expect(deleteApiCredentialsHandler(req as unknown as Request, res as unknown as Response)).rejects.toThrow('Failed to delete client credentials: 500')
  })
})
