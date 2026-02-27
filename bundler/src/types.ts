import { Modality } from './config/config'
import type { LocaleReleaseData } from './core/localeData'

export const ProblemClipReason = {
  TOO_SMALL: 'TOO_SMALL', // GCS object size <= MIN_AUDIO_SIZE_BYTES (likely corrupt)
  TOO_SHORT: 'TOO_SHORT', // 0 < duration < MIN_AUDIO_DURATION_MS (warn, kept)
  LONG: 'LONG', // CLIP_DURATION_WARN_MS < duration <= MAX_AUDIO_DURATION_MS (warn, kept)
  TOO_LONG: 'TOO_LONG', // duration > MAX_AUDIO_DURATION_MS (excluded)
  DURATION_ZERO: 'DURATION_ZERO', // mp3-duration-reporter returned 0 ms (excluded)
  FAILED_DOWNLOAD: 'FAILED_DOWNLOAD', // GCS download failed (excluded)
} as const
export type ProblemClipReason =
  (typeof ProblemClipReason)[keyof typeof ProblemClipReason]

export type ProblemClipStatus = 'EXCLUDED' | 'WARN'

export type ProblemClip = {
  path: string
  locale: string
  reason: ProblemClipReason
  status: ProblemClipStatus
  timestamp: string // ISO 8601 -- when the problem was detected
}

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

export type VariantInfo = {
  variantToken: string // e.g. "southwes"
  variantName: string // e.g. "Southern Welsh" (value in clips.tsv variant column)
  clipCount: number
}

export type Settings = {
  type: 'full' | 'delta' | 'statistics' | 'variants'
  from: string
  until: string
  releaseName: string
  previousReleaseName?: string
  languages: string[]
  licenseMode?: LicenseMode
  modality?: Modality
  datasheetsFile?: string // e.g. "datasheets-25.0-2026-03-06.json"
}

export type DatasheetLocalePayload = {
  template: string
  community_fields: Record<string, string>
  metadata: Record<string, string>
}

export type ProcessLocaleJob = Settings & {
  locale: string
  license?: string // specific license for this job (e.g., 'CC-BY-SA-4.0')
  expectedClipCount?: number // from init query; used for progress tracking
  datasheetPayload?: DatasheetLocalePayload
  variants?: VariantInfo[] // only for type === 'variants'; one job carries ALL variants for its locale
}

export type LocaleWithLicense = {
  name: string
  license: string
  clip_count: number
}

export const VALIDATED_SENTENCE_COLUMNS = [
  'sentence_id',
  'sentence',
  'variant',
  'sentence_domain',
  'source',
  'is_used',
  'clips_count',
] as const

export type ValidatedSentence = Record<
  (typeof VALIDATED_SENTENCE_COLUMNS)[number],
  string
>

export const UNVALIDATED_SENTENCE_COLUMNS = [
  'sentence_id',
  'sentence',
  'variant',
  'sentence_domain',
  'source',
  'up_votes',
  'down_votes',
  'status',
] as const

export type UnvalidatedSentence = Record<
  (typeof UNVALIDATED_SENTENCE_COLUMNS)[number],
  string
>

export type AppEnv = Settings & {
  locale: string
  releaseDirPath: string
  clipsDirPath: string
  releaseTarballsDirPath: string
  uploadPath: string // precomputed GCS path, e.g. "cv-corpus-25.0/cv-corpus-25.0-en.tar.gz"
  license?: string // specific license for this job (e.g., 'CC-BY-SA-4.0', or NULL for unlicensed)
  // Derived in processor.ts for 'full' releases: "${releaseName}-delta" (with "-licensed" suffix when processing a licensed job).
  // When set, fetchAllClipsPipeline will download this tarball for new clips instead of pulling them individually from GCS
  // This will prevent ~15 clips/sec bandwidth bottleneck and speed up the total time needed for releases.
  // Workflow change needed: Release the delta first!
  deltaReleaseName?: string
  datasheetPayload?: DatasheetLocalePayload
  localeData?: LocaleReleaseData // populated by scanLocaleData step; shared by datasheets + stats
  problemClips: ProblemClip[] // mutable accumulator, freshly initialised per job
  clipCount: number // set after stats step; 0 until then
  startTimestamp: string // ISO 8601 -- set by deriveJobEnv at job start
}
