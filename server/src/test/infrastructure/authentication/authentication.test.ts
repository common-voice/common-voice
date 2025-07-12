import { deleteClientCredentials } from '../../../infrastructure/authentication/authentication'
import { getConfig, CommonVoiceConfig } from '../../../config-helper'

// Mock the config helper
jest.mock('../../../config-helper')

// Mock fetch globally
global.fetch = jest.fn()

const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('deleteClientCredentials', () => {
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
