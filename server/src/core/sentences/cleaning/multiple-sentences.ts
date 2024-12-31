import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'

export const cleanRawMultipleSentencesInput = (sentences: string) =>
  pipe(
    sentences.split('\n'),
    A.map(s => s.replace(/\s+/g, ' ').trim()),
    A.filter(s => s.length > 0)
  )
