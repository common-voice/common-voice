import { createClientCredentialsCommandHandler } from '../../../../application/profile/command-handler/createClientCredentialsCommandHandler'
import { createClientCredentials } from '../../../../infrastructure/authentication/authentication'
import { CreateClientCredentialsCommand } from '../../../../application/profile/command-handler/command/createClientCredentialsCommand'

// Mock the dependencies
jest.mock('../../../../infrastructure/authentication/authentication')

const mockCreateClientCredentials = jest.mocked(createClientCredentials)

describe('createClientCredentialsCommandHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create client credentials', async () => {
    const command: CreateClientCredentialsCommand = {
      userId: 'user-123',
      description: 'Test application',
    }

    const mockResponse = {
      userId: 'user-123',
      clientId: 'client-456',
      clientSecret: 'secret-789',
      description: 'Test application',
      permissions: [
        { permission_id: 1, name: 'audio:recording:create', description: 'Create audio recordings' },
        { permission_id: 2, name: 'audio:recording:upload', description: 'Upload audio recordings' },
        { permission_id: 3, name: 'audio:recording:read', description: 'Read audio recordings' },
        { permission_id: 4, name: 'audio:recording:list', description: 'List audio recordings' },
        { permission_id: 5, name: 'text:submission:read', description: 'Read text submissions' },
        { permission_id: 6, name: 'text:submission:list', description: 'List text submissions' },
      ],
    }

    mockCreateClientCredentials.mockResolvedValue(mockResponse)

    const result = await createClientCredentialsCommandHandler(command)

    expect(mockCreateClientCredentials).toHaveBeenCalledWith({
      userId: 'user-123',
      description: 'Test application',
      permissions: [
        'audio:recording:create',
        'audio:recording:upload',
        'audio:recording:read',
        'audio:recording:list',
        'text:submission:read',
        'text:submission:list',
      ],
    })

    expect(result).toEqual({
      userId: 'user-123',
      clientId: 'client-456',
      clientSecret: 'secret-789',
      description: 'Test application',
      permissions: [
        'audio:recording:create',
        'audio:recording:upload',
        'audio:recording:read',
        'audio:recording:list',
        'text:submission:read',
        'text:submission:list',
      ],
    })
  })

  it('should handle errors from createClientCredentials', async () => {
    const command: CreateClientCredentialsCommand = {
      userId: 'user-123',
      description: 'Test application',
    }

    mockCreateClientCredentials.mockRejectedValue(new Error('Failed to create client credentials: 500'))

    await expect(createClientCredentialsCommandHandler(command)).rejects.toThrow('Failed to create client credentials: 500')

    expect(mockCreateClientCredentials).toHaveBeenCalledWith({
      userId: 'user-123',
      description: 'Test application',
      permissions: [
        'audio:recording:create',
        'audio:recording:upload',
        'audio:recording:read',
        'audio:recording:list',
        'text:submission:read',
        'text:submission:list',
      ],
    })
  })
})
