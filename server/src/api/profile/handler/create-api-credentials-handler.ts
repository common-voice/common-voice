import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { createClientCredentialsCommandHandler } from '../../../application/profile/command-handler/createClientCredentialsCommandHandler'

export const createApiCredentialsHandler = async (
  req: Request,
  res: Response
) => {
  const clientId = req.session.user.client_id

  if (!clientId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no client id' })

  return createClientCredentialsCommandHandler({
    userId: clientId,
    description: req.body.description,
  })
}
