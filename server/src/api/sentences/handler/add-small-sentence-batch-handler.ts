import { Request, Response } from 'express'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { createPresentableError } from '../../../application/helper/error-helper'
import { findLocaleByNameInDb } from '../../../application/repository/locale-repository'
import {
  findDomainIdByNameInDb,
  insertBulkSentencesIntoDb,
} from '../../../application/repository/sentences-repository'
import { findVariantByTagInDb } from '../../../application/repository/variant-repository'
import { AddMultipleSentencesCommandHandler } from '../../../application/sentences/use-case/command-handler/add-multiple-sentences-command-handler'
import { AddMultipleSentencesCommand } from '../../../application/sentences/use-case/command-handler/command/add-multiple-sentences-command'

export default async (req: Request, res: Response) => {
  const { sentences, localeName, source, domains, variant } = req.body

  const command: AddMultipleSentencesCommand = {
    clientId: req.client_id,
    rawSentenceInput: sentences,
    localeName: localeName,
    source: source,
    domains: domains,
    variant: O.fromNullable(variant),
  }

  const cmdHandler = pipe(
    AddMultipleSentencesCommandHandler,
    I.ap(findDomainIdByNameInDb),
    I.ap(findVariantByTagInDb),
    I.ap(findLocaleByNameInDb),
    I.ap(insertBulkSentencesIntoDb)
  )

  const result = await pipe(
    command,
    cmdHandler,
    TE.mapLeft(createPresentableError),
    TE.matchW(
      err => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        return err
      },
      sentencesWithErrors => sentencesWithErrors
    )
  )()

  return res.json(result)
}
