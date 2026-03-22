/* eslint-disable @typescript-eslint/no-var-requires */
// Config module reads process.env at import time, so we use
// jest.isolateModules + require to get a fresh module per test.

type ConfigModule = typeof import('./config')

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  jest.resetModules()
})

const loadConfig = (): ConfigModule => {
  let mod!: ConfigModule
  jest.isolateModules(() => {
    mod = require('./config') as ConfigModule
  })
  return mod
}

const clearEnv = () => {
  delete process.env.ENVIRONMENT
  delete process.env.LOG_LEVEL
  delete process.env.REDIS_URL
  delete process.env.DB_HOST
  delete process.env.DB_PORT
  delete process.env.DB_DATABASE
  delete process.env.DB_USER
  delete process.env.DB_PASSWORD
  delete process.env.CLIPS_BUCKET_NAME
  delete process.env.DATASETS_BUNDLER_BUCKET_NAME
  delete process.env.STORAGE_LOCAL_DEVELOPMENT_ENDPOINT
  delete process.env.CLIP_DOWNLOAD_CONCURRENCY
  delete process.env.STREAM_COMPRESS_CLIP_THRESHOLD
}

describe('config defaults (no env vars)', () => {
  beforeEach(clearEnv)

  it('getEnvironment defaults to local', () => {
    expect(loadConfig().getEnvironment()).toBe('local')
  })

  it('getLogLevel defaults to info for local', () => {
    expect(loadConfig().getLogLevel()).toBe('info')
  })

  it('getRedisUrl defaults to redis', () => {
    expect(loadConfig().getRedisUrl()).toBe('redis')
  })

  it('getDbConfig returns defaults', () => {
    const db = loadConfig().getDbConfig()
    expect(db.host).toBe('db')
    expect(db.port).toBe(3306)
    expect(db.database).toBe('voiceweb')
    expect(db.user).toBe('voicecommons')
    expect(db.charset).toBe('utf8mb4')
  })

  it('getClipsBucketName defaults to common-voice-clips', () => {
    expect(loadConfig().getClipsBucketName()).toBe('common-voice-clips')
  })

  it('getDatasetBundlerBucketName defaults to common-voice-bundler', () => {
    expect(loadConfig().getDatasetBundlerBucketName()).toBe('common-voice-bundler')
  })

  it('getTmpDir returns project root for local env', () => {
    // local env resolves to __dirname/../../ which is the bundler root
    expect(loadConfig().getTmpDir()).toMatch(/bundler$/)
  })

  it('STREAM_COMPRESS_CLIP_THRESHOLD defaults to 2000000', () => {
    expect(loadConfig().STREAM_COMPRESS_CLIP_THRESHOLD).toBe(2_000_000)
  })

  it('VERBOSITY_CHOICES contains all valid levels', () => {
    expect(loadConfig().VERBOSITY_CHOICES).toEqual([
      'quiet',
      'normal',
      'verbose',
      'debug',
    ])
  })
})

describe('config with env vars', () => {
  beforeEach(clearEnv)

  it('LOG_LEVEL=debug overrides environment default', () => {
    process.env.LOG_LEVEL = 'debug'
    process.env.ENVIRONMENT = 'production'
    expect(loadConfig().getLogLevel()).toBe('debug')
  })

  it('sandbox environment defaults to debug log level', () => {
    process.env.ENVIRONMENT = 'sandbox'
    expect(loadConfig().getLogLevel()).toBe('debug')
  })

  it('staging environment defaults to debug log level', () => {
    process.env.ENVIRONMENT = 'staging'
    expect(loadConfig().getLogLevel()).toBe('debug')
  })

  it('stage environment defaults to debug log level', () => {
    process.env.ENVIRONMENT = 'stage'
    expect(loadConfig().getLogLevel()).toBe('debug')
  })

  it('production environment defaults to info log level', () => {
    process.env.ENVIRONMENT = 'production'
    expect(loadConfig().getLogLevel()).toBe('info')
  })

  it('invalid LOG_LEVEL falls back to environment default', () => {
    process.env.LOG_LEVEL = 'verbose'
    process.env.ENVIRONMENT = 'sandbox'
    expect(loadConfig().getLogLevel()).toBe('debug')
  })

  it('DB_PORT is parsed as number', () => {
    process.env.DB_PORT = '3307'
    expect(loadConfig().getDbConfig().port).toBe(3307)
  })

  it('REDIS_URL overrides default', () => {
    process.env.REDIS_URL = 'redis-cluster'
    expect(loadConfig().getRedisUrl()).toBe('redis-cluster')
  })

  it('getTmpDir returns /cache for non-local env', () => {
    process.env.ENVIRONMENT = 'production'
    expect(loadConfig().getTmpDir()).toBe('/cache')
  })

  it('CLIPS_BUCKET_NAME overrides default', () => {
    process.env.CLIPS_BUCKET_NAME = 'my-clips'
    expect(loadConfig().getClipsBucketName()).toBe('my-clips')
  })

  it('DATASETS_BUNDLER_BUCKET_NAME overrides default', () => {
    process.env.DATASETS_BUNDLER_BUCKET_NAME = 'my-bundler'
    expect(loadConfig().getDatasetBundlerBucketName()).toBe('my-bundler')
  })

  it('STREAM_COMPRESS_CLIP_THRESHOLD overrides default', () => {
    process.env.STREAM_COMPRESS_CLIP_THRESHOLD = '500000'
    expect(loadConfig().STREAM_COMPRESS_CLIP_THRESHOLD).toBe(500_000)
  })
})
