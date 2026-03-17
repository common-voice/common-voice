import * as path from 'node:path'
import { io as IO } from 'fp-ts'

const TMP_DIR = '/cache'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

export type DbConfig = {
  host: string
  port: number
  database: string
  user: string
  password: string
  charset: string
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

const resolveLogLevel = (env: string): LogLevel => {
  // LOG_LEVEL is optional -- no deployment config changes needed.
  // Falls back to environment-based defaults derived from the existing ENVIRONMENT var.
  const explicit = process.env.LOG_LEVEL as LogLevel | undefined
  if (
    explicit &&
    ['debug', 'info', 'warn', 'error', 'silent'].includes(explicit)
  ) {
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
    charset: 'utf8mb4',
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

/**
 * Locales above this clip count stream the output tarball directly to GCS
 * during compress, avoiding the need for local disk space for the tarball.
 * Below this threshold the tarball is written locally then uploaded.
 * Override via STREAM_COMPRESS_CLIP_THRESHOLD env var in k8s.
 */
export const STREAM_COMPRESS_CLIP_THRESHOLD =
  Number(process.env.STREAM_COMPRESS_CLIP_THRESHOLD) || 2_000_000

export const getQueriesDir = getQueriesDir_
export const getRedisUrl = getRedisUrl_(config)
export const getStorageLocalEndpoint = getStorageLocalEndpoint_(config)
export const getEnvironment = getEnvironment_(config)
export const getLogLevel = getLogLevel_(config)
export const getDbConfig = getDbConfig_(config)
export const getClipsBucketName = getClipsBucketName_(config)
export const getDatasetBundlerBucketName = getDatasetBundlerBucketName_(config)
export const getTmpDir = getTmpDir_(config)
