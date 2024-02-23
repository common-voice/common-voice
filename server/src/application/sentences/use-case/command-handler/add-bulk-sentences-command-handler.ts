import { pipe } from 'fp-ts/lib/function'
import { InsertBulkSentences } from '../../repository/sentences-repository'
import { taskEither as TE } from 'fp-ts'
import { AddBulkSentencesCommand } from './command/add-bulk-sentences-command'
import { ReadTsvIntoMemory } from '../../../../infrastructure/parser/tsvParser'
import { FetchUserClientIdByEmail } from '../../repository/user-repository'

export const AddBulkSentencesCommandHandler =
  (readTsvIntoMemory: ReadTsvIntoMemory) =>
  (fetchUserClientIdByEmail: FetchUserClientIdByEmail) =>
  (insertBulkSentences: InsertBulkSentences) =>
  (cmd: AddBulkSentencesCommand) => {
    return pipe(
      TE.Do,
      TE.bind('sentences', () =>
        readTsvIntoMemory<{
          'Sentence (mandatory)': string
          'Source (mandatory)': string
        }>(cmd.tsvFile)
      ),
      TE.bind('clientId', () => fetchUserClientIdByEmail(cmd.email)),
      TE.map(({ sentences, clientId }) =>
        sentences.map(submission => ({
          sentence: submission['Sentence (mandatory)'],
          source: submission['Source (mandatory)'],
          locale_id: cmd.localeId,
          client_id: clientId,
        }))
      ),
      TE.chain(insertBulkSentences)
    )
  }
