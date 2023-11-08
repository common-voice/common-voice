import {io as IO } from 'fp-ts'
import path from 'node:path'

export type DbConfig = {
    host: string
    port: number
    database: string
    user: string
    password: string
}

export type Config = {
    environment: string
    releaseName: string
    dbConfig: DbConfig
    clipsBucketName: string,
    datasetBundlerBucketName: string
    storageLocalEndpoint: string
    includeClipsFrom: string
    includeClipsUntil: string
}


const config: Config = {
    environment: process.env.ENVIRONMENT || 'local',
    releaseName: process.env.DATASET_RELEASE_NAME || 'cv-corpus',
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
    includeClipsFrom: process.env.INCLUDE_CLIPS_FROM || '2000-01-01 00:00:00',
    includeClipsUntil: process.env.INCLUDE_CLIPS_UNTIL || '2099-01-01 00:00:00'
}

const getStorageLocalEndpoint_ = (config: Config): IO.IO<string> => () => config.storageLocalEndpoint
const getEnvironment_ = (config: Config): IO.IO<string> => () => config.environment
const getReleaseBasePath_ = (config: Config): IO.IO<string> => () => path.join(__dirname, '..', '..', config.releaseName)
const getQueriesDir_ = (config: Config): IO.IO<string> => () => path.join(__dirname, '..', '..', 'queries')
const getReleaseClipsDirPath_ = (config: Config) => (locale: string): IO.IO<string> => () => path.join(__dirname, '..', '..', config.releaseName, locale, 'clips')
const getReleaseTarballsDirPath_ = (config: Config): IO.IO<string> => () => path.join(__dirname, '..', '..', config.releaseName, 'tarballs' )
const getReleaseName_ = (config: Config): IO.IO<string> => () => config.releaseName 
const getDbConfig_ = (config: Config): IO.IO<DbConfig> => () => config.dbConfig 
const getClipsBucketName_ = (config: Config): IO.IO<string> => () => config.clipsBucketName 
const getDatasetBundlerBucketName_ = (config: Config): IO.IO<string> => () => config.datasetBundlerBucketName
const getIncludeClipsFrom_ = (config: Config): IO.IO<string> => () => config.includeClipsFrom
const getIncludeClipsUntil_ = (config: Config): IO.IO<string> => () => config.includeClipsUntil

export const getQueriesDir = getQueriesDir_(config)
export const getReleaseClipsDirPath = getReleaseClipsDirPath_(config)
export const getReleaseTarballsDirPath = getReleaseTarballsDirPath_(config)
export const getStorageLocalEndpoint = getStorageLocalEndpoint_(config)
export const getEnvironment = getEnvironment_(config)
export const getReleaseBasePath = getReleaseBasePath_(config)
export const getReleaseName = getReleaseName_(config)
export const getDbConfig = getDbConfig_(config)
export const getClipsBucketName = getClipsBucketName_(config)
export const getDatasetBundlerBucketName = getDatasetBundlerBucketName_(config)
export const getIncludeClipsFrom = getIncludeClipsFrom_(config)
export const getIncludeClipsUntil = getIncludeClipsUntil_(config)
