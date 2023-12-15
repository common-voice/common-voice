import {io as IO } from 'fp-ts'
import path from 'node:path'

const TMP_DIR = '/cache'

export type DbConfig = {
    host: string
    port: number
    database: string
    user: string
    password: string
}

export type Config = {
    environment: string
    redisUrl: string
    dbConfig: DbConfig
    clipsBucketName: string,
    datasetBundlerBucketName: string
    storageLocalEndpoint: string
}


const config: Config = {
    environment: process.env.ENVIRONMENT || 'local',
    redisUrl: process.env.REDIS_URL || 'redis',
    dbConfig: {
        host: process.env.DB_HOST || 'db',
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_DATABASE || 'voiceweb',
        user: process.env.DB_USER || 'voicecommons',
        password: process.env.DB_PASSWORD || 'voicecommns',
    },
    clipsBucketName: process.env.CLIPS_BUCKET_NAME || 'common-voice-clips' ,
    datasetBundlerBucketName: process.env.DATASETS_BUNDLER_BUCKET_NAME || 'common-voice-bundler',
    storageLocalEndpoint: process.env.STORAGE_LOCAL_DEVELOPMENT_ENDPOINT || 'http://storage:8080',
}

const getStorageLocalEndpoint_ = (config: Config): IO.IO<string> => () => config.storageLocalEndpoint
const getEnvironment_ = (config: Config): IO.IO<string> => () => config.environment
const getQueriesDir_: IO.IO<string> = () => path.join(__dirname, '..', '..', 'queries')
const getDbConfig_ = (config: Config): IO.IO<DbConfig> => () => config.dbConfig 
const getClipsBucketName_ = (config: Config): IO.IO<string> => () => config.clipsBucketName 
const getDatasetBundlerBucketName_ = (config: Config): IO.IO<string> => () => config.datasetBundlerBucketName
const getRedisUrl_ = (config: Config): IO.IO<string> => () => config.redisUrl
const getTmpDir_ = (config: Config): IO.IO<string> => () => config.environment === 'local' ? path.join(__dirname, '..', '..') : path.resolve(TMP_DIR)

export const getQueriesDir = getQueriesDir_
export const getRedisUrl = getRedisUrl_(config)
export const getStorageLocalEndpoint = getStorageLocalEndpoint_(config)
export const getEnvironment = getEnvironment_(config)
export const getDbConfig = getDbConfig_(config)
export const getClipsBucketName = getClipsBucketName_(config)
export const getDatasetBundlerBucketName = getDatasetBundlerBucketName_(config)
export const getTmpDir = getTmpDir_(config)
