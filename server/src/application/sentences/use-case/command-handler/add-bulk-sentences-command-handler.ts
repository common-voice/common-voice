import { pipe } from 'fp-ts/lib/function'
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
        readTsvIntoMemory<{
          'Sentence (mandatory)': string
          'Source (mandatory)': string
          'Domain (optional)': string
          'Variant (optional, where applicable)': string
        }>(cmd.tsvFile)
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
            let sub: SentenceSubmission = {
              sentence: submission['Sentence (mandatory)']
                .trim()
                .replace(/\s/gi, ' '),
              source: submission['Source (mandatory)'].trim(),
              locale_id: cmd.localeId,
              client_id: clientId,
              variant_id: O.none,
            }

            if (submission['Domain (optional)'] !== '') {
              const domainDescription = submission[
                'Domain (optional)'
              ].trim() as SentenceDomainDescription
              const domain = domains.find(
                d => d.description === domainDescription
              )

              if (domain) {
                sub = {
                  ...sub,
                  domain_ids: [domain.id],
                }
              }
            }

            if (submission['Variant (optional, where applicable)'] !== '') {
              const variantTag =
                submission['Variant (optional, where applicable)']
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
