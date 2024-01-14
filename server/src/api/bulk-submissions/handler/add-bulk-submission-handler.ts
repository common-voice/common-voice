import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AddBulkSubmissionCommand } from '../../../application/bulk-submissions/use-case/command-handler/command/add-bulk-submission-command'
import { Readable } from 'stream'
import { addBulkSubmissionCommandHandler } from '../../../application/bulk-submissions/use-case/command-handler/add-bulk-submission-command-handler'
import { pipe } from 'fp-ts/lib/function'
import { task as T, taskEither as TE } from 'fp-ts'
import { createPresentableError } from '../../../application/helper/error-helper'
import { ApplicationError } from '../../../application/types/error'

const SIZE_LIMIT_IN_MB = 25
const SIZE_LIMIT_IN_BYTES = 1024 * 1024 * SIZE_LIMIT_IN_MB

const readBodyFromRequest = (req: Request): Promise<Buffer> => {
  return new Promise(res => {
    const fileStream = Readable.from(req)
    const data: Buffer[] = []

    fileStream
      .on('data', (chunk: Buffer) => {
        data.push(chunk)
      })
      .on('end', () => {
        res(Buffer.concat(data))
      })
  })
}

export const handler =
  (
    cmdHandler: (
      cmd: AddBulkSubmissionCommand
    ) => TE.TaskEither<ApplicationError, boolean>
  ) =>
    async (req: Request, res: Response) => {
      const {
        client_id,
        headers,
        params: { locale },
      } = req

      const size = Number(headers['content-length'])

      if (!client_id)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'no client id' })

      if (size >= SIZE_LIMIT_IN_BYTES)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `file is larger than ${SIZE_LIMIT_IN_MB}MB` })

      const file = await readBodyFromRequest(req)

      if (size !== file.length)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'file size is not matching content-length' })

      const cmd: AddBulkSubmissionCommand = {
        filename: String(headers.filename),
        submitter: client_id,
        locale: locale,
        file: file.toString('hex'),
        size: size,
      }

      return pipe(
        cmd,
        cmdHandler,
        TE.mapLeft(createPresentableError),
        TE.fold(
          err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
          () => T.of(res.json({ message: 'Bulk submission added' }))
        )
      )()
    }

export const addBulkSubmissionHandler = handler(addBulkSubmissionCommandHandler)
