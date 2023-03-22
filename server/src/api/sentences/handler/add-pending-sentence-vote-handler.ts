import { Request, Response } from 'express'
import { pipe } from 'fp-ts/lib/function'
import { task as T, taskEither as TE } from 'fp-ts'
import { StatusCodes } from 'http-status-codes'
import { addPendingSentenceVoteCommandHandler } from '../../../application/sentences/use-case/command-handler/add-pending-sentence-vote-command-handler'
import { AddPendingSentenceVoteCommand } from '../../../application/sentences/use-case/command-handler/command/add-pending-sentence-vote-command'
import { createPresentableError } from '../../../application/helper/error-helper'

export default async (req: Request, res: Response) => {
  const command: AddPendingSentenceVoteCommand = {
    clientId: req.client_id || null,
    pendingSentenceId: req.body.pending_sentence_id,
    isValid: req.body.is_valid,
  }

  return pipe(
    command,
    addPendingSentenceVoteCommandHandler,
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
      () => T.of(res.sendStatus(StatusCodes.OK))
    )
  )()
}
