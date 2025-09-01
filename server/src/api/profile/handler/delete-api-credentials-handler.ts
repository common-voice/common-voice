import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { deleteClientCredentialsCommandHandler } from '../../../application/profile/command-handler/deleteClientCredentialsCommandHandler'
import { getClientCredentialsQueryHandler } from '../../../application/profile/query-handler/getClientCredentialsQueryHandler'

export const deleteApiCredentialsHandler = async (req: Request, res: Response) => {
  const userId = req?.session?.user?.client_id
  if (!userId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no user client id' })

  const clientId = req.params.client_id

  // Ensure that clientId belongs to this user
  const userCredentials = await getClientCredentialsQueryHandler({
    userId: userId,
  })
  const credentialExists = userCredentials.some((credential: any) => credential.clientId === clientId)
  if (!credentialExists) {
    return res.status(StatusCodes.NO_CONTENT).end()
  }

  // Delete the credential
  await deleteClientCredentialsCommandHandler({
    clientId: clientId,
  })

  return res.status(StatusCodes.NO_CONTENT).end()
}
