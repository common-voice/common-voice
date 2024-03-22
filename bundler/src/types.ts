export type ClipRow = {
  id: string
  client_id: string
  path: string
  sentence_id: string
  sentence: string
  sentence_domain: string
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
  'sentence_id',
  'sentence',
  'locale',
  'reason',
] as const

export type ReportedSentencesRow = Record<typeof REPORTED_SENTENCES_COLUMNS[number], string>

export type Settings = {
  type: 'full' | 'delta'
  from: string
  until: string
  releaseName: string
  previousReleaseName?: string
}

export type ProcessLocaleJob = Settings & {
  locale: string
}

export type AppEnv = Settings & {
  locale: string
  releaseDirPath: string
  clipsDirPath: string
  releaseTarballsDirPath: string
}
