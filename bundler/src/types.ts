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

export type ReportedSentencesRow = Record<
  (typeof REPORTED_SENTENCES_COLUMNS)[number],
  string
>

export type LicenseMode = 'unlicensed' | 'licensed' | 'both'

export type Settings = {
  type: 'full' | 'delta' | 'statistics'
  from: string
  until: string
  releaseName: string
  previousReleaseName?: string
  languages: string[]
  licenseMode?: LicenseMode
}

export type ProcessLocaleJob = Settings & {
  locale: string
  license?: string // specific license for this job (e.g., 'CC-BY-SA-4.0')
}

export type LocaleWithLicense = {
  name: string
  license: string
}

export type AppEnv = Settings & {
  locale: string
  releaseDirPath: string
  clipsDirPath: string
  releaseTarballsDirPath: string
  license?: string // specific license for this job (e.g., 'CC-BY-SA-4.0', or NULL for unlicensed)
}
