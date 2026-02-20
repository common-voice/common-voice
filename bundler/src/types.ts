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
  clip_count: number
}

export type ValidatedSentence = {
  sentence_id: string
  sentence: string
  sentence_domain: string
  source: string
  is_used: string
  clips_count: string
}

export type UnvalidatedSentence = {
  sentence_id: string
  sentence: string
  sentence_domain: string
  source: string
}

export type AppEnv = Settings & {
  locale: string
  releaseDirPath: string
  clipsDirPath: string
  releaseTarballsDirPath: string
  license?: string // specific license for this job (e.g., 'CC-BY-SA-4.0', or NULL for unlicensed)
  // Derived in processor.ts for 'full' releases: "${releaseName}-delta" (with "-licensed" suffix when processing a licensed job).
  // When set, fetchAllClipsPipeline will download this tarball for new clips instead of pulling them individually from GCS
  // This will prevent ~15 clips/sec bandwidth bottleneck and speed up the total time needed for releases.
  // Workflow change needed: Release the delta first!
  deltaReleaseName?: string
}
