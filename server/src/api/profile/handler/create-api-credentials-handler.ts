import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { createClientCredentialsCommandHandler } from '../../../application/profile/command-handler/createClientCredentialsCommandHandler'
import { getClientCredentialsQueryHandler } from '../../../application/profile/query-handler/getClientCredentialsQueryHandler'

const MAX_CREDENTIALS_PER_USER = 10

export const createApiCredentialsHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req?.session?.user?.client_id
  if (!userId) {
    console.log('no user id')
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'no user client id' })
  }

  const userCredentials = await getClientCredentialsQueryHandler({
    userId: userId,
  })

  if (userCredentials.length >= MAX_CREDENTIALS_PER_USER) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'too many credentials' })
  }

  const result = await createClientCredentialsCommandHandler({
    userId: userId,
    description: req.body.description,
  })

  return res.json(result)
}
