import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AddBulkSubmissionCommand } from '../../../application/bulk-submissions/use-case/command-handler/command/add-bulk-submission-command'
import { Readable } from 'stream'
import { addBulkSubmissionCommandHandler } from '../../../application/bulk-submissions/use-case/command-handler/add-bulk-submission-command-handler'
import { pipe } from 'fp-ts/lib/function'
import { task as T, taskEither as TE } from 'fp-ts'
import { createPresentableError } from '../../../application/helper/error-helper'

export const addBulkSubmissionHandler = async (req: Request, res: Response) => {
  const {
    client_id,
    headers,
    params: { locale },
  } = req
  const size = Number(headers['content-length'])

  if (!client_id) return res.sendStatus(StatusCodes.BAD_REQUEST)

  if (size >= 1024 * 8) return res.sendStatus(StatusCodes.BAD_REQUEST)

  const fileStream = Readable.from(req)
  const data = []
  for await (const chunk of fileStream) {
    data.push(chunk)
  }
  const file = Buffer.concat(data)

  const cmd: AddBulkSubmissionCommand = {
    filename: String(headers.filename),
    submitter: client_id,
    locale: locale,
    file: file.toString('hex'),
    size: size,
  }

  return pipe(
    cmd,
    addBulkSubmissionCommandHandler,
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
      () => T.of(res.json({ message: 'Bulk submission added' }))
    )
  )()
}
