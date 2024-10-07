import * as fs from 'fs'
import { SESClientConfig } from '@aws-sdk/client-ses'
import { config } from 'dotenv'

if (process.env.DOTENV_CONFIG_PATH) {
  const result = config({ path: process.env.DOTENV_CONFIG_PATH })
  if (result.error) {
    console.log(result.error)
    console.log('Failed loading dotenv file, using defaults')
  }
}

export type CommonVoiceConfig = {
  VERSION: string
  PROD: boolean
  SERVER_PORT: number
  DB_ROOT_USER: string
  DB_ROOT_PASS: string
  MYSQLUSER: string
  MYSQLPASS: string
  MYSQLDBNAME: string
  MYSQLHOST: string
  MYSQLREPLICAHOST?: string
  MYSQLPORT: number
  MYSQLREPLICAPORT?: number
  CLIP_BUCKET_NAME: string
  DATASET_BUCKET_NAME: string
  BULK_SUBMISSION_BUCKET_NAME: string
  AWS_REGION: string
  ENVIRONMENT: string
  RELEASE_VERSION?: string
  SECRET: string
  AWS_SES_CONFIG: SESClientConfig
  STORAGE_LOCAL_DEVELOPMENT_ENDPOINT: string
  GCP_CREDENTIALS: object
  ADMIN_EMAILS: string
  AUTH0: {
    DOMAIN: string
    CLIENT_ID: string
    CLIENT_SECRET: string
  }
  BASKET_API_KEY?: string
  IMPORT_SENTENCES: boolean
  REDIS_URL: string
  LAST_DATASET: string
  SENTRY_DSN_SERVER: string
  MAINTENANCE_MODE: boolean
  DEBUG: boolean
  FLAG_BUFFER_STREAM_ENABLED: boolean
  EMAIL_USERNAME_FROM: string
  EMAIL_USERNAME_TO: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const castDefault = (value: string): any => value
const castBoolean = (value: string): boolean => value === 'true'
const castInt = (value: string): number => parseInt(value)
const castJson = (value: string): object => JSON.parse(value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configEntry = (key: string, defaultValue: any, cast = castDefault) =>
  process.env[key] ? cast(process.env[key]) : defaultValue

const BASE_CONFIG: CommonVoiceConfig = {
  VERSION: configEntry('CV_VERSION', null), // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: configEntry('GIT_COMMIT_SHA', null), // X-Release-Version header
  PROD: configEntry('CV_PROD', true, castBoolean), // Set to true for staging and production.
  SERVER_PORT: configEntry('CV_SERVER_PORT', 9090, castInt),
  DB_ROOT_USER: configEntry('CV_DB_ROOT_USER', 'root'), // For running schema migrations.
  DB_ROOT_PASS: configEntry('CV_DB_ROOT_PASS', ''),
  MYSQLUSER: configEntry('CV_MYSQLUSER', 'voicecommons'), // For normal DB interactions.
  MYSQLPASS: configEntry('CV_MYSQLPASS', 'voicecommons'),
  MYSQLDBNAME: configEntry('CV_MYSQLDBNAME', 'voiceweb'),
  MYSQLHOST: configEntry('CV_MYSQLHOST', 'localhost'),
  MYSQLPORT: configEntry('CV_MYSQLPORT', 3306, castInt),
  MYSQLREPLICAHOST: configEntry('CV_MYSQLREPLICAHOST', ''),
  MYSQLREPLICAPORT: configEntry('CV_MYSQLREPLICAPORT', 3306, castInt),
  CLIP_BUCKET_NAME: configEntry('CV_CLIP_BUCKET_NAME', 'common-voice-clips'),
  DATASET_BUCKET_NAME: configEntry(
    'CV_DATASET_BUCKET_NAME',
    'common-voice-datasets'
  ),
  BULK_SUBMISSION_BUCKET_NAME: configEntry(
    'CV_BULK_SUBMISSION_BUCKET_NAME',
    'common-voice-bulk-submissions'
  ),
  ENVIRONMENT: configEntry('CV_ENVIRONMENT', 'prod'),
  SECRET: configEntry('CV_SECRET', 'super-secure-secret'),
  ADMIN_EMAILS: configEntry('CV_ADMIN_EMAILS', null),
  AWS_REGION: configEntry('CV_AWS_REGION', 'us-west-2'),
  AWS_SES_CONFIG: configEntry('CV_AWS_SES_CONFIG', {}, castJson),
  STORAGE_LOCAL_DEVELOPMENT_ENDPOINT: configEntry(
    'CV_STORAGE_LOCAL_DEVELOPMENT_ENDPOINT',
    'http://localhost:8080'
  ),
  GCP_CREDENTIALS: configEntry('CV_GCP_CREDENTIALS', {}, castJson),
  AUTH0: {
    DOMAIN: configEntry('CV_AUTH0_DOMAIN', ''),
    CLIENT_ID: configEntry('CV_AUTH0_CLIENT_ID', ''),
    CLIENT_SECRET: configEntry('CV_AUTH0_CLIENT_SECRET', ''),
  },
  IMPORT_SENTENCES: configEntry('CV_IMPORT_SENTENCES', true, castBoolean),
  REDIS_URL: configEntry('CV_REDIS_URL', null),
  LAST_DATASET: configEntry('CV_LAST_DATASET', '2019-06-12'),
  SENTRY_DSN_SERVER: configEntry('CV_SENTRY_DSN_SERVER', ''),
  MAINTENANCE_MODE: configEntry('CV_MAINTENANCE_MODE', false, castBoolean),
  BASKET_API_KEY: configEntry('CV_BASKET_API_KEY', null),
  DEBUG: configEntry('CV_DEBUG', false, castBoolean),
  FLAG_BUFFER_STREAM_ENABLED: configEntry(
    'CV_FLAG_BUFFER_STREAM_ENABLED',
    false,
    castBoolean
  ),
  EMAIL_USERNAME_FROM: configEntry('CV_EMAIL_USERNAME_FROM', null),
  EMAIL_USERNAME_TO: configEntry('CV_EMAIL_USERNAME_TO', null),
}

let injectedConfig: CommonVoiceConfig
let loadedConfig: CommonVoiceConfig

export function injectConfig(config: Partial<CommonVoiceConfig>) {
  injectedConfig = { ...BASE_CONFIG, ...config }
}

export function getConfig(): CommonVoiceConfig {
  if (injectedConfig) {
    return injectedConfig
  }

  if (loadedConfig) {
    return loadedConfig
  }

  let fileConfig = null

  try {
    const config_path = process.env.SERVER_CONFIG_PATH || './config.json'
    fileConfig = JSON.parse(fs.readFileSync(config_path, 'utf-8'))
  } catch (err) {
    console.error(
      `Could not load config.json, using defaults (error message: ${err.message})`
    )
  }
  loadedConfig = { ...BASE_CONFIG, ...fileConfig }

  return loadedConfig
}
