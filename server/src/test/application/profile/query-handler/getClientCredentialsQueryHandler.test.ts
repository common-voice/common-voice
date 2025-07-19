import { getClientCredentialsQueryHandler } from '../../../../application/profile/query-handler/getClientCredentialsQueryHandler'
import { getClientCredentials } from '../../../../infrastructure/authentication/authentication'
import { GetClientCredentialsQuery } from '../../../../application/profile/query-handler/query/getClientCredentialsQuery'

// Mock the infrastructure dependency
jest.mock('../../../../infrastructure/authentication/authentication')

const mockGetClientCredentials = jest.mocked(getClientCredentials)

describe('getClientCredentialsQueryHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve client credentials for a user', async () => {
    const query: GetClientCredentialsQuery = {
      userId: 'user-123',
    }

    const mockCredentials = [
      {
        userId: 'user-123',
        clientId: 'client-456',
        description: 'Test application 1',
        permissions: ['audio:recording:create', 'audio:recording:upload'],
      },
      {
        userId: 'user-123',
        clientId: 'client-789',
        description: 'Test application 2',
        permissions: ['text:submission:read', 'text:submission:list'],
      },
    ]

    mockGetClientCredentials.mockResolvedValue(mockCredentials)

    const result = await getClientCredentialsQueryHandler(query)

    expect(mockGetClientCredentials).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(result).toEqual(mockCredentials)
  })

  it('should handle errors from getClientCredentials', async () => {
    const query: GetClientCredentialsQuery = {
      userId: 'user-123',
    }

    mockGetClientCredentials.mockRejectedValue(new Error('Failed to retrieve client credentials: 500'))

    await expect(getClientCredentialsQueryHandler(query)).rejects.toThrow('Failed to retrieve client credentials: 500')

    expect(mockGetClientCredentials).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })
})
