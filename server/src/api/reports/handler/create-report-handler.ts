import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const createReportHandler = async (req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK)
}
