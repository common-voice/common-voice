import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getClientCredentialsQueryHandler } from '../../../application/profile/query-handler/getClientCredentialsQueryHandler'

export const getApiCredentialsHandler = async (req: Request, res: Response) => {
  const clientId = req.session.user.client_id

  if (!clientId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no client id' })

  const credentials = await getClientCredentialsQueryHandler({
    userId: clientId,
  })

  return res.json(credentials)
}
