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
export const createClientCredentialsCommandHandler = (
  cmd: CreateClientCredentialsCommand
) => {
  return createClientCredentials({
    ...cmd,
    permissions: INITIAL_PERMISSIONS,
  })
}
