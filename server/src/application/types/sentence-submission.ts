import { Option } from 'fp-ts/Option'
import { Variant } from '../../core/types/variant'

export type SentenceSubmission = {
  sentence: string
  source: string
  locale_id: number
  client_id: string
  domain_ids?: number[] | null
  variant: Option<Variant>
}
