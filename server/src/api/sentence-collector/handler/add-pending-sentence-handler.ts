import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import AddSentenceCommandHandler from '../../../application/sentence-collector/use-case/command-handler/add-pending-sentence-command-handler'
import { AddSentenceCommand } from '../../../application/sentence-collector/use-case/command-handler/command/add-pending-sentence-command'
import {
  ApplicationError,
  PendingSentencesRepositoryErrorKind,
  PendingSentenceValidationKind,
} from '../../../application/types/error'

export default async (req: Request, res: Response) => {
  const { sentence, localeId, localeName, source } = req.body

  const command: AddSentenceCommand = {
    clientId: req.client_id,
    sentence: sentence,
    localeId: localeId,
    localeName: localeName,
    source: source,
  }

  pipe(
    AddSentenceCommandHandler(command),
    TE.fold(
      (err: ApplicationError) => {
        const { error, ...show } = err
        switch (err.kind) {
          case PendingSentencesRepositoryErrorKind: {
            return T.of(res.status(500).json(show))
          }
          case PendingSentenceValidationKind:
            return T.of(res.status(400).json(show))
        }
      },
      () => T.of(res.status(200).json({ status: 'success' }))
    )
  )()
}
