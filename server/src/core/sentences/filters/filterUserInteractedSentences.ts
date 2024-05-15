import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import { Sentence } from 'common'

export const filterUserInteractedSentences =
  (interactedSentenceIds: string[]) => (sentences: Sentence[]) =>
    pipe(
      sentences,
      A.filter(
        sentence =>
          !pipe(
            interactedSentenceIds,
            A.exists(sentenceId => sentenceId === sentence.id)
          )
      )
    )
