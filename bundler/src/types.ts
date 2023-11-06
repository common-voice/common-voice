export type ClipRow = {
  id: string
  client_id: string
  path: string
  sentence: string
  up_votes: string
  down_votes: string
  age: string
  gender: string
  accents: string
  variant: string
  locale: string
  segment: string
}

export const REPORTED_SENTENCES_COLUMNS = [
  'sentence',
  'sentence_id',
  'locale',
  'reason',
] as const

export type ReportedSentencesRow = Record<typeof REPORTED_SENTENCES_COLUMNS[number], string>

export type ProcessLocaleJob = {
  locale: string
  isMinorityLanguage: boolean
}
