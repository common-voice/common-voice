import {
  ValidatedSentence,
  UnvalidatedSentence,
  VALIDATED_SENTENCE_COLUMNS,
  UNVALIDATED_SENTENCE_COLUMNS,
} from '../types'
import { TSV_COLUMNS } from '../core/clips'

// -- Clips.tsv ---------------------------------------------------------------

export const CLIPS_TSV_HEADER = TSV_COLUMNS.join('\t')

type ClipRowOverrides = Partial<Record<(typeof TSV_COLUMNS)[number], string>>

const CLIP_ROW_DEFAULTS: Record<(typeof TSV_COLUMNS)[number], string> = {
  client_id: 'user1',
  path: 'clip1.mp3',
  sentence_id: 'sid1',
  sentence: 'Hello',
  sentence_domain: 'general',
  up_votes: '2',
  down_votes: '0',
  age: 'twenties',
  gender: 'male_masculine',
  accents: '',
  variant: '',
  locale: 'en',
  segment: '',
}

export const makeClipRow = (overrides: ClipRowOverrides = {}): string => {
  const merged = { ...CLIP_ROW_DEFAULTS, ...overrides }
  return TSV_COLUMNS.map(col => merged[col]).join('\t')
}

// -- Validated sentences -----------------------------------------------------

export const toValidatedSentencesTsv = (
  rows: ValidatedSentence[],
): string => {
  const header = VALIDATED_SENTENCE_COLUMNS.join('\t')
  const dataRows = rows.map(row =>
    VALIDATED_SENTENCE_COLUMNS.map(col => row[col]).join('\t'),
  )
  return [header, ...dataRows].join('\n')
}

export const makeValidatedSentence = (
  overrides: Partial<ValidatedSentence> = {},
): ValidatedSentence => ({
  sentence_id: 'vs1',
  sentence: 'Validated sentence',
  variant: '',
  sentence_domain: 'general',
  source: 'Wikipedia',
  is_used: '1',
  clips_count: '3',
  ...overrides,
})

// -- Unvalidated sentences ---------------------------------------------------

export const toUnvalidatedSentencesTsv = (
  rows: UnvalidatedSentence[],
): string => {
  const header = UNVALIDATED_SENTENCE_COLUMNS.join('\t')
  const dataRows = rows.map(row =>
    UNVALIDATED_SENTENCE_COLUMNS.map(col => row[col]).join('\t'),
  )
  return [header, ...dataRows].join('\n')
}

export const makeUnvalidatedSentence = (
  overrides: Partial<UnvalidatedSentence> = {},
): UnvalidatedSentence => ({
  sentence_id: 'us1',
  sentence: 'Unvalidated sentence',
  variant: '',
  sentence_domain: 'general',
  source: 'Wikipedia',
  up_votes: '0',
  down_votes: '0',
  status: 'pending',
  ...overrides,
})
