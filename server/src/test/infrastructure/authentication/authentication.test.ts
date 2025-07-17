import { 
  deleteClientCredentials, 
  createClientCredentials, 
  getClientCredentials 
} from '../../../infrastructure/authentication/authentication'
import { getConfig, CommonVoiceConfig } from '../../../config-helper'

// Mock the config helper
jest.mock('../../../config-helper')

// Mock fetch globally
global.fetch = jest.fn()

const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('authentication', () => {
  const mockConfig: Partial<CommonVoiceConfig> = {
    AUTH_SERVICE_URL: 'https://auth.example.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetConfig.mockReturnValue(mockConfig as CommonVoiceConfig)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('deleteClientCredentials', () => {
    it('should successfully delete client credentials', async () => {
      const clientInfo = { clientId: 'client-123' }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 204
      } as Response)

      await deleteClientCredentials(clientInfo)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://auth.example.com/internal/auth/clients/client-123',
        {
          method: 'DELETE'
        }
      )
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when response is not ok', async () => {
      const clientInfo = { clientId: 'client-123' }

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      } as Response)

      await expect(deleteClientCredentials(clientInfo)).rejects.toThrow(
        'Failed to delete client credentials: 500'
      )
    })
  })

  describe('createClientCredentials', () => {
    it('should successfully create client credentials', async () => {
      const clientInfo = {
        userId: 'user-123',
        description: 'Test application',
        permissions: ['audio:recording:create', 'audio:recording:upload']
      }

      const mockResponse = {
        userId: 'user-123',
        clientId: 'client-456',
        clientSecret: 'secret-789',
        description: 'Test application',
        permissions: [
          { permission_id: 1, name: 'audio:recording:create', description: 'Create audio recordings' },
          { permission_id: 2, name: 'audio:recording:upload', description: 'Upload audio recordings' }
        ]
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue(mockResponse)
      } as any)

      const result = await createClientCredentials(clientInfo)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://auth.example.com/internal/auth/clients',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientInfo)
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error when response is not ok', async () => {
      const clientInfo = {
        userId: 'user-123',
        description: 'Test application',
        permissions: ['audio:recording:create']
      }

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400
      } as Response)

      await expect(createClientCredentials(clientInfo)).rejects.toThrow(
        'Failed to create client credentials: 400'
      )
    })
  })

  describe('getClientCredentials', () => {
    it('should successfully get client credentials', async () => {
      const clientInfo = { userId: 'user-123' }

      const mockResponse = [
        {
          userId: 'user-123',
          clientId: 'client-456',
          description: 'Test application 1',
          permissions: ['audio:recording:create', 'audio:recording:upload']
        },
        {
          userId: 'user-123',
          clientId: 'client-789',
          description: 'Test application 2',
          permissions: ['text:submission:read', 'text:submission:list']
        }
      ]

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse)
      } as any)

      const result = await getClientCredentials(clientInfo)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://auth.example.com/internal/auth/clients?userId=user-123'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle URL encoding for userId', async () => {
      const clientInfo = { userId: 'user@example.com' }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([])
      } as any)

      await getClientCredentials(clientInfo)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://auth.example.com/internal/auth/clients?userId=user%40example.com'
      )
    })

    it('should throw an error when response is not ok', async () => {
      const clientInfo = { userId: 'user-123' }

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      } as Response)

      await expect(getClientCredentials(clientInfo)).rejects.toThrow(
        'Failed to retrieve client credentials: 500'
      )
    })
  })
})
