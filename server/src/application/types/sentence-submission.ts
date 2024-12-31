import { Option } from 'fp-ts/Option'

export type SentenceSubmission = {
  sentence: string
  source: string
  locale_id: number
  client_id: string
  domain_ids: Option<number[]>
  variant_id: Option<number>
}
