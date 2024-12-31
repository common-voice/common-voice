import { Option } from 'fp-ts/Option'

import { SentenceDomain } from 'common'

export type AddMultipleSentencesCommand = {
  clientId: string
  rawSentenceInput: string
  localeName: string
  source: string
  domains: SentenceDomain[]
  variant: Option<string>
}
