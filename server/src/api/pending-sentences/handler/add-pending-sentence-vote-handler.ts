import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export default async (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK)
}
