import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import { AddSentenceCommandHandler } from '../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import { AddSentenceCommand } from '../../../application/sentences/use-case/command-handler/command/add-sentence-command'
import {
  SentencesRepositoryErrorKind,
  SentenceValidationKind,
} from '../../../application/types/error'
import { createPresentableError } from '../../../application/helper/error-helper'
import { StatusCodes } from 'http-status-codes'

export default async (req: Request, res: Response) => {
  const { sentence, localeId, localeName, source } = req.body

  const command: AddSentenceCommand = {
    clientId: req.client_id,
    sentence: sentence,
    localeId: localeId,
    localeName: localeName,
    source: source,
  }

  return pipe(
    AddSentenceCommandHandler(command),
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => {
        switch (err.kind) {
          case SentencesRepositoryErrorKind: {
            return T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err))
          }
          case SentenceValidationKind:
            return T.of(res.status(StatusCodes.BAD_REQUEST).json(err))
        }
      },
      () => T.of(res.contentType('text/plain').sendStatus(StatusCodes.OK))
    )
  )()
}
