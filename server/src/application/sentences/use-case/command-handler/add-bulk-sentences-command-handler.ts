import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import { InsertBulkSentences } from '../../../repository/sentences-repository'
import { taskEither as TE } from 'fp-ts'
import { AddBulkSentencesCommand } from './command/add-bulk-sentences-command'
import { ReadTsvIntoMemory } from '../../../../infrastructure/parser/tsvParser'
import { FetchUserClientIdByEmail } from '../../../repository/user-repository'
import { FetchSentenceDomains } from '../../../repository/domain-repository'
import { SentenceDomainDescription } from 'common'
import { SentenceSubmission } from '../../../types/sentence-submission'

export const AddBulkSentencesCommandHandler =
  (readTsvIntoMemory: ReadTsvIntoMemory) =>
  (fetchUserClientIdByEmail: FetchUserClientIdByEmail) =>
  (fetchSentenceDomains: FetchSentenceDomains) =>
  (insertBulkSentences: InsertBulkSentences) =>
  (cmd: AddBulkSentencesCommand) => {
    return pipe(
      TE.Do,
      TE.bind('sentences', () =>
        readTsvIntoMemory<{
          'Sentence (mandatory)': string
          'Source (mandatory)': string
          'Domain (optional)': string
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
      TE.chainFirst(() => TE.right(console.log('Mapping submission data'))),
      TE.map(({ sentences, clientId, domains }): SentenceSubmission[] =>
        sentences.map(submission => {
          let sub: SentenceSubmission = {
            sentence: submission['Sentence (mandatory)'],
            source: submission['Source (mandatory)'],
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

          return sub
        })
      ),
      TE.chainFirst(() => TE.right(console.log('Start inserting sentences ...'))),
      TE.chain(insertBulkSentences)
    )
  }
