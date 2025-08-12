import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import { findFirst } from 'fp-ts/Array'
import { InsertBulkSentences } from '../../../repository/sentences-repository'
import { taskEither as TE } from 'fp-ts'
import { AddBulkSentencesCommand } from './command/add-bulk-sentences-command'
import { ReadTsvIntoMemory } from '../../../../infrastructure/parser/tsvParser'
import { FetchUserClientIdByEmail } from '../../../repository/user-repository'
import { FetchSentenceDomains } from '../../../repository/domain-repository'
import { SentenceDomainDescription } from 'common'
import { SentenceSubmission } from '../../../types/sentence-submission'
import { FetchVariants } from '../../../repository/variant-repository'
import * as S from 'fp-ts/lib/string'
import * as A from 'fp-ts/lib/Array'
import { cleanText } from '../../../text-cleaner'

export const AddBulkSentencesCommandHandler =
  (readTsvIntoMemory: ReadTsvIntoMemory) =>
  (fetchUserClientIdByEmail: FetchUserClientIdByEmail) =>
  (fetchSentenceDomains: FetchSentenceDomains) =>
  (fetchVariants: FetchVariants) =>
  (insertBulkSentences: InsertBulkSentences) =>
  (cmd: AddBulkSentencesCommand) => {
    return pipe(
      TE.Do,
      TE.bind('sentences', () =>
        pipe(
          readTsvIntoMemory<{
            'Sentence (mandatory)': string
            'Source (mandatory)': string
            'Domain (optional)': string
            'Variant (optional, where applicable)': string
          }>(cmd.tsvFile),
          TE.map(A.map(toLowerAndRemoveContentInScopes))
        )
      ),
      TE.chainFirst(() => TE.right(console.log('Fetching user client email'))),
      TE.bind('clientId', () => fetchUserClientIdByEmail(cmd.email)),
      TE.chainFirst(() => TE.right(console.log('Fetching sentence domains'))),
      TE.bind('domains', () =>
        pipe(
          fetchSentenceDomains(),
          TE.mapLeft(appErr => appErr.error)
        )
      ),
      TE.chainFirst(() => TE.right(console.log('Fetching variants'))),
      TE.bind('variants', () =>
        pipe(
          fetchVariants(),
          TE.mapLeft(appErr => appErr.error)
        )
      ),
      TE.chainFirst(() => TE.right(console.log('Mapping submission data'))),
      TE.map(
        ({ sentences, clientId, domains, variants }): SentenceSubmission[] =>
          sentences.map(submission => {
            console.log(submission)
            let sub: SentenceSubmission = {
              sentence: cleanText(submission['sentence']),
              source: cleanText(submission['source']),
              locale_id: cmd.localeId,
              client_id: clientId,
              domain_ids: O.none,
              variant_id: O.none,
            }

            if (submission['domain']) {
              const domainDescription = submission[
                'domain'
              ].trim() as SentenceDomainDescription
              const domain = domains.find(
                d => d.description === domainDescription
              )

              if (domain) {
                sub = {
                  ...sub,
                  domain_ids: O.some([domain.id]),
                }
              }
            }

            if (submission['variant']) {
              const variantTag = submission['variant']
              const variantId = pipe(
                variants,
                findFirst(v => v.tag === variantTag),
                O.map(v => v.id)
              )

              sub = {
                ...sub,
                variant_id: variantId,
              }
            }

            return sub
          })
      ),
      TE.chainFirst(() =>
        TE.right(console.log('Start inserting sentences ...'))
      ),
      TE.chain(insertBulkSentences)
    )
  }

const transformObjectKeys =
  (f: (k: string) => string) =>
  (obj: { [key: string]: string }): { [key: string]: string } =>
    Object.keys(obj).reduce((acc, k) => {
      acc[f(k)] = obj[k]
      return acc
    }, {} as { [key: string]: string })

const toLowerAndRemoveContentInScopes = flow(
  transformObjectKeys(S.toLowerCase),
  transformObjectKeys(S.replace(/\s*\(.*\)\s*/, ''))
)
