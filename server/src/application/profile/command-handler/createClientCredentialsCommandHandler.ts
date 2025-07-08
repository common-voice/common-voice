import { createClientCredentials } from '../../../infrastructure/authentication/authentication'
import { CreateClientCredentialsCommand } from './command/createClientCredentialsCommand'

const INITIAL_PERMISSIONS = [
  'audio:recording:create',
  'audio:recording:upload',
  'audio:recording:read',
  'audio:recording:list',
  'text:submission:read',
  'text:submission:list',
]
export const createClientCredentialsCommandHandler = async (
  cmd: CreateClientCredentialsCommand
) => {
  const clientCredentials = await createClientCredentials({
    ...cmd,
    permissions: INITIAL_PERMISSIONS,
  })

  return {...clientCredentials, permissions: clientCredentials.permissions.map(p => p.name)}
}
