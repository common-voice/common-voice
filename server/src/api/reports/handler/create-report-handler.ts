import { Request, Response } from 'express'
import { pipe } from 'fp-ts/function'
import { taskEither as TE, task as T } from 'fp-ts'
import { StatusCodes } from 'http-status-codes'
import { CreateReportCommand } from '../../../application/reports/use-case/command-handler/command/create-report-command'
import { createReportCommandHandler } from '../../../application/reports/use-case/command-handler/create-report-command-handler'
import { createPresentableError } from '../../../application/helper/error-helper'

export const createReportHandler = async (req: Request, res: Response) => {
  const userId = req?.session?.user?.client_id
  if (!userId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'no user client id' })

  const cmd: CreateReportCommand = {
    clientId: userId,
    kind: req.body.kind,
    id: req.body.id,
    reasons: req.body.reasons,
  }

  return pipe(
    cmd,
    createReportCommandHandler,
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
      () =>
        T.of(
          res.json({
            message: 'Report created successfully',
          })
        )
    )
  )()
}
