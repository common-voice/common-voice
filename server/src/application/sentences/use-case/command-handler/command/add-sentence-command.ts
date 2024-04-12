import { Option } from 'fp-ts/Option'

import { SentenceDomain } from "common"

export type AddSentenceCommand = {
  clientId: string
  sentence: string
  localeId: number
  localeName: string
  source: string,
  domains: SentenceDomain[]
  variant: Option<string> 
}
