import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import AddPendingSentenceCommandHandler from '../../../application/pending-sentences/use-case/command-handler/add-pending-sentence-command-handler'
import { AddPendingSentenceCommand } from '../../../application/pending-sentences/use-case/command-handler/command/add-pending-sentence-command'
import {
  PendingSentencesRepositoryErrorKind,
  PendingSentenceValidationKind,
} from '../../../application/types/error'
import { createPresentableError } from '../../../application/helper/error-helper'
import { StatusCodes } from 'http-status-codes'

export default async (req: Request, res: Response) => {
  const { sentence, localeId, localeName, source } = req.body

  const command: AddPendingSentenceCommand = {
    clientId: req.client_id,
    sentence: sentence,
    localeId: localeId,
    localeName: localeName,
    source: source,
  }

  return pipe(
    AddPendingSentenceCommandHandler(command),
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => {
        switch (err.kind) {
          case PendingSentencesRepositoryErrorKind: {
            return T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err))
          }
          case PendingSentenceValidationKind:
            return T.of(res.status(StatusCodes.BAD_REQUEST).json(err))
        }
      },
      () => T.of(res.sendStatus(StatusCodes.OK))
    )
  )()
}
