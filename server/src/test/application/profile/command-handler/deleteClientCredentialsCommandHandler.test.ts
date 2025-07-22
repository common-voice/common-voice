import { deleteClientCredentialsCommandHandler } from '../../../../application/profile/command-handler/deleteClientCredentialsCommandHandler'
import { deleteClientCredentials } from '../../../../infrastructure/authentication/authentication'
import { DeleteClientCredentialsCommand } from '../../../../application/profile/command-handler/command/deleteClientCredentialsCommand'

// Mock the dependencies
jest.mock('../../../../infrastructure/authentication/authentication')

const mockDeleteClientCredentials = jest.mocked(deleteClientCredentials)

describe('deleteClientCredentialsCommandHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully delete client credentials', async () => {
    const command: DeleteClientCredentialsCommand = {
      clientId: 'client-123'
    }

    mockDeleteClientCredentials.mockResolvedValue(undefined)

    await deleteClientCredentialsCommandHandler(command)

    expect(mockDeleteClientCredentials).toHaveBeenCalledWith({
      clientId: 'client-123'
    })
    expect(mockDeleteClientCredentials).toHaveBeenCalledTimes(1)
  })

  it('should handle errors from deleteClientCredentials', async () => {
    const command: DeleteClientCredentialsCommand = {
      clientId: 'client-456'
    }

    const error = new Error('Failed to delete client credentials: 500')
    mockDeleteClientCredentials.mockRejectedValue(error)

    await expect(deleteClientCredentialsCommandHandler(command)).rejects.toThrow(
      'Failed to delete client credentials: 500'
    )

    expect(mockDeleteClientCredentials).toHaveBeenCalledWith({
      clientId: 'client-456'
    })
    expect(mockDeleteClientCredentials).toHaveBeenCalledTimes(1)
  })
})
