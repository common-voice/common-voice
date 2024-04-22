import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { AddSentenceCommandHandler } from '../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import { AddSentenceCommand } from '../../../application/sentences/use-case/command-handler/command/add-sentence-command'
import {
  SentenceRepositoryErrorKind,
  SentenceValidationErrorKind,
} from '../../../application/types/error'
import { createPresentableError } from '../../../application/helper/error-helper'
import { StatusCodes } from 'http-status-codes'
import { validateSentence } from '../../../core/sentences'
import {
  findDomainIdByNameInDb,
  saveSentenceInDb,
} from '../../../application/sentences/repository/sentences-repository'
import { findVariantByTagInDb } from '../../../application/sentences/repository/variant-repository'

export default async (req: Request, res: Response) => {
  const { sentence, localeId, localeName, source, domains, variant } = req.body

  const command: AddSentenceCommand = {
    clientId: req.client_id,
    sentence: sentence,
    localeId: localeId,
    localeName: localeName,
    source: source,
    domains: domains,
    variant: O.fromNullable(variant),
  }

  const cmdHandler = pipe(
    AddSentenceCommandHandler,
    I.ap(validateSentence),
    I.ap(findDomainIdByNameInDb),
    I.ap(findVariantByTagInDb),
    I.ap(saveSentenceInDb)
  )

  const result = await pipe(
    command,
    cmdHandler,
    TE.mapLeft(createPresentableError),
    TE.match(
      err => {
        switch (err.kind) {
          case SentenceRepositoryErrorKind: {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            break;
          }
          case SentenceValidationErrorKind: {
            res.status(StatusCodes.BAD_REQUEST)
            break;
          }
        }

        return err
      },
      () => ({ message: 'Sentence added successfully' })
    )
  )()

  return res.json(result)
}
