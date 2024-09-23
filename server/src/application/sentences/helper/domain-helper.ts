import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { FindDomainIdByName } from '../../repository/sentences-repository'
import { ApplicationError } from '../../types/error'

export const toDomainIds =
  (findDomainId: FindDomainIdByName) =>
  (domains: string[]): TE.TaskEither<ApplicationError, number[]> => {
    const findDomainIds = domains.map(domain => findDomainId(domain))
    return pipe(
      findDomainIds,
      TE.sequenceArray,
      TE.map(domainIds => pipe(domainIds, O.sequenceArray)),
      TE.map(domainIds =>
        pipe(
          domainIds,
          O.getOrElse(() => [])
        )
      )
    )
  }
