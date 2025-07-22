import { deleteClientCredentials } from '../../../infrastructure/authentication/authentication'
import { DeleteClientCredentialsCommand } from './command/deleteClientCredentialsCommand'

export const deleteClientCredentialsCommandHandler = async (
  cmd: DeleteClientCredentialsCommand
) => {
  await deleteClientCredentials({
    ...cmd,
  })
}
