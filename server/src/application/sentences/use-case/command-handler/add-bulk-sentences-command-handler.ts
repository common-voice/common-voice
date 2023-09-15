import { pipe } from 'fp-ts/lib/function'
import { insertBulkSentencesIntoDb, insertSentenceIntoDb } from '../../repository/sentences-repository'
import { either as E, taskEither as TE } from 'fp-ts'
import { AddBulkSentencesCommand } from './command/add-bulk-sentences-command'
import { readTsvIntoMemory } from '../../../../infrastructure/parser/tsvParser'

export const AddBulkSentencesCommandHandler = (
  cmd: AddBulkSentencesCommand
) => {
  return pipe(
    readTsvIntoMemory<{ Sentence: string; Source: string }>(cmd.tsvFile),
    TE.map(sentences =>
      sentences.map(submission => ({
        sentence: submission.Sentence,
        source: submission.Source,
        locale_id: cmd.localeId,
        client_id: cmd.clientId,
      }))
    ),
    TE.chain(insertBulkSentencesIntoDb)
  )
}
