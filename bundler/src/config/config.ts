import * as path from 'node:path'
import { io as IO } from 'fp-ts'

const TMP_DIR = '/cache'

// ---------------------------------------------------------------------------
// Time-unit enums
// ---------------------------------------------------------------------------

/** Duration constants in milliseconds. */
export enum TimeUnitsMs {
  SECOND = 1_000,
  MINUTE = 60_000,
  HOUR = 3_600_000,
  DAY = 86_400_000,
  WEEK = 604_800_000,
}

/** Duration constants in seconds. */
export enum TimeUnitsSec {
  SECOND = 1,
  MINUTE = 60,
  HOUR = 3_600,
  DAY = 86_400,
  WEEK = 604_800,
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type DbConfig = {
  host: string
  port: number
  database: string
  user: string
  password: string
}

export type Config = {
  environment: string
  logLevel: LogLevel
  redisUrl: string
  dbConfig: DbConfig
  clipsBucketName: string
  datasetBundlerBucketName: string
  storageLocalEndpoint: string
}

// Base URL for pre-compiled datasheets JSON files in the cv-datasheets repo.
// The filename (e.g. "datasheets-v25.0-2026-03-06.json") is provided via CLI.
export const DATASHEETS_BASE_URL =
  'https://raw.githubusercontent.com/common-voice/cv-datasheets/main/releases'

export type Modality = 'scripted' | 'spontaneous' | 'code_switching'

// Maps CLI modality names to the keys used in datasheets.json.
// Once cv-datasheets adopts the canonical names this map can be removed.
export const MODALITY_TO_DATASHEETS_KEY: Record<Modality, string> = {
  scripted: 'scs',
  spontaneous: 'sps',
  code_switching: 'cs',
}

// Audio clip quality thresholds
export const MIN_AUDIO_SIZE_BYTES = 256 // GCS objects at or below this size are considered corrupt
export const MIN_AUDIO_DURATION_MS = 500 // clips below this duration are flagged TOO_SHORT (WARN)
export const CLIP_DURATION_WARN_MS = 17_000 // clips above this duration are flagged LONG (WARN)
export const MAX_AUDIO_DURATION_MS = 30_000 // clips above this duration are excluded (TOO_LONG / EXCLUDED)

// ---------------------------------------------------------------------------
// Release logging
// ---------------------------------------------------------------------------

/** Upload a GCS snapshot of accumulated logs every N completed locales. */
export const RELEASE_LOG_FLUSH_INTERVAL = 10

/**
 * TTL applied to all release-scoped Redis keys.
 * Keeps data accessible for post-release review without permanent accumulation.
 */
export const RELEASE_LOG_KEY_TTL_SEC = TimeUnitsSec.WEEK

// ---------------------------------------------------------------------------
// Redis key builders
//
// Prefix `scripted:` namespaces keys for the scripted-speech bundler.
// Future bundlers (SPS, CS) can use their own prefix without colliding.
// ---------------------------------------------------------------------------

const REDIS_PREFIX = 'scripted'

export const redisKeys = {
  /** List of serialised TSV rows for the problem-clips report. */
  problemClips: (releaseName: string) =>
    `${REDIS_PREFIX}:log:problem-clips:${releaseName}`,
  /** List of serialised TSV rows for the process-log report. */
  processLog: (releaseName: string) =>
    `${REDIS_PREFIX}:log:process:${releaseName}`,
  /** Counter — number of locale jobs completed (incremented by each pod). */
  localeCount: (releaseName: string) =>
    `${REDIS_PREFIX}:jobs:count:${releaseName}`,
  /** Total locale jobs scheduled (accumulated with INCRBY across batches). */
  localeTotal: (releaseName: string) =>
    `${REDIS_PREFIX}:jobs:total:${releaseName}`,
  /**
   * SET of locale names that have been successfully processed.
   * Used as a fast-path duplicate check before the authoritative GCS call.
   */
  done: (releaseName: string) => `${REDIS_PREFIX}:done:${releaseName}`,
}

const resolveLogLevel = (env: string): LogLevel => {
  // LOG_LEVEL is optional -- no deployment config changes needed.
  // Falls back to environment-based defaults derived from the existing ENVIRONMENT var.
  const explicit = process.env.LOG_LEVEL as LogLevel | undefined
  if (explicit && ['debug', 'info', 'warn', 'error'].includes(explicit)) {
    return explicit
  }
  // sandbox / staging / stage default to debug; production and local default to info
  return env === 'sandbox' || env === 'staging' || env === 'stage'
    ? 'debug'
    : 'info'
}

const environment = process.env.ENVIRONMENT || 'local'

const config: Config = {
  environment,
  logLevel: resolveLogLevel(environment),
  redisUrl: process.env.REDIS_URL || 'redis',
  dbConfig: {
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'voiceweb',
    user: process.env.DB_USER || 'voicecommons',
    password: process.env.DB_PASSWORD || 'voicecommons',
  },
  clipsBucketName: process.env.CLIPS_BUCKET_NAME || 'common-voice-clips',
  datasetBundlerBucketName:
    process.env.DATASETS_BUNDLER_BUCKET_NAME || 'common-voice-bundler',
  storageLocalEndpoint:
    process.env.STORAGE_LOCAL_DEVELOPMENT_ENDPOINT || 'http://storage:8080',
}

const getStorageLocalEndpoint_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.storageLocalEndpoint
const getEnvironment_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.environment
const getLogLevel_ =
  (config: Config): IO.IO<LogLevel> =>
  () =>
    config.logLevel
const getQueriesDir_: IO.IO<string> = () =>
  path.join(__dirname, '..', '..', 'queries')
const getDbConfig_ =
  (config: Config): IO.IO<DbConfig> =>
  () =>
    config.dbConfig
const getClipsBucketName_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.clipsBucketName
const getDatasetBundlerBucketName_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.datasetBundlerBucketName
const getRedisUrl_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.redisUrl
const getTmpDir_ =
  (config: Config): IO.IO<string> =>
  () =>
    config.environment === 'local'
      ? path.join(__dirname, '..', '..')
      : path.resolve(TMP_DIR)

export const getQueriesDir = getQueriesDir_
export const getRedisUrl = getRedisUrl_(config)
export const getStorageLocalEndpoint = getStorageLocalEndpoint_(config)
export const getEnvironment = getEnvironment_(config)
export const getLogLevel = getLogLevel_(config)
export const getDbConfig = getDbConfig_(config)
export const getClipsBucketName = getClipsBucketName_(config)
export const getDatasetBundlerBucketName = getDatasetBundlerBucketName_(config)
export const getTmpDir = getTmpDir_(config)
