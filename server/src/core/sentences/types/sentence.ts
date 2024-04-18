import { Option } from 'fp-ts/Option'

export type UnvalidatedSentence = {
  sentence: string
  sentenceId: string
  source: string
  localeId: number
  variantTag: Option<string>
}

export type ValidatedSentence = string
