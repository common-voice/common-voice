import * as TE from 'fp-ts/TaskEither'
import { ApplicationError } from '../types/error'
import { Domain, domainDescriptionMap } from '../../core/domains/domain'
import { pipe } from 'fp-ts/lib/function'
import { queryDb } from '../../infrastructure/db/mysql'
import { createDatabaseError } from '../helper/error-helper'
import { SentenceDomain, TimeUnits } from 'common'

export type FetchSentenceDomains = () => TE.TaskEither<
  ApplicationError,
  Domain[]
>
export const fetchSentenceDomains: FetchSentenceDomains = () =>
  pipe(
    queryDb('SELECT id, domain as name FROM domains')([]),
    TE.map(([result]: Array<{ id: number; name: SentenceDomain }[]>) =>
      result.map(d => ({
        id: d.id,
        name: d.name,
        description: domainDescriptionMap[d.name],
      }))
    ),
    TE.mapLeft((err: Error) =>
      createDatabaseError('Error fetching sentence domains', err)
    )
  )
