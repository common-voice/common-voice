import { Request, Response } from 'express'
import { pipe } from 'fp-ts/lib/function'
import { task as T, taskEither as TE } from 'fp-ts'
import { StatusCodes } from 'http-status-codes'
import { addSentenceVoteCommandHandler } from '../../../application/sentences/use-case/command-handler/add-sentence-vote-command-handler'
import { AddSentenceVoteCommand } from '../../../application/sentences/use-case/command-handler/command/add-sentence-vote-command'
import { createPresentableError } from '../../../application/helper/error-helper'

export default async (req: Request, res: Response) => {
  if (!req.client_id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Missing client_id' })
  }

  const command: AddSentenceVoteCommand = {
    clientId: req.client_id,
    sentenceId: req.body.sentence_id,
    vote: req.body.vote,
  }

  return pipe(
    command,
    addSentenceVoteCommandHandler,
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
      () => T.of(res.json({ message: 'Vote added successfully' }))
    )
  )()
}
