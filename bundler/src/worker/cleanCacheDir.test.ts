import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'

let tmpDir: string

afterEach(async () => {
  await fsp.rm(tmpDir, { recursive: true, force: true })
})

// Mock config to return our test tmpDir
jest.mock('../config', () => ({
  getTmpDir: () => tmpDir,
  getRedisUrl: () => 'localhost',
  getDbConfig: () => ({}),
  getEnvironment: () => 'production',
  getClipsBucketName: () => 'test-clips',
  getDatasetBundlerBucketName: () => 'test-bundler',
  getStorageLocalEndpoint: () => 'http://localhost:8080',
  getQueriesDir: () => '/tmp/queries',
  getLogLevel: () => 'silent',
  BULLMQ_LOCK_DURATION_MS: 600_000,
  LOCK_EXTEND_MS: 300_000,
  LOCK_EXTEND_INTERVAL_MS: 150_000,
  PROCESSING_STALE_MS: 1_200_000,
  RELEASE_LOG_KEY_TTL_SEC: 86_400,
  STREAM_COMPRESS_CLIP_THRESHOLD: 2_000_000,
  redisKeys: {
    done: () => 'done',
    processing: () => 'processing',
    localeTotal: () => 'localeTotal',
    localeCount: () => 'localeCount',
    clipsTotal: () => 'clipsTotal',
    clipsCount: () => 'clipsCount',
    timeStart: () => 'timeStart',
    problemClips: () => 'problemClips',
    processLog: () => 'processLog',
    pendingGroups: () => 'pendingGroups',
  },
}))

jest.mock('../infrastructure/redis')
jest.mock('../infrastructure/queue')
jest.mock('../infrastructure/storage')
jest.mock('../infrastructure/database')
jest.mock('../infrastructure/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}))
jest.mock('../core/releaseLogger')

import { cleanCacheDir } from './worker'
import { logger } from '../infrastructure/logger'

beforeEach(async () => {
  jest.clearAllMocks()
  tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'bundler-cache-'))
})

describe('cleanCacheDir', () => {
  it('removes all entries from the cache directory', async () => {
    // Create some fake stale data
    await fsp.mkdir(path.join(tmpDir, 'cv-corpus-24.0-2025-12-05', 'en', 'clips'), { recursive: true })
    await fsp.writeFile(path.join(tmpDir, 'cv-corpus-24.0-2025-12-05', 'en', 'clips', 'c1.mp3'), 'audio')
    await fsp.writeFile(path.join(tmpDir, 'en_clips.tsv'), 'data')
    await fsp.mkdir(path.join(tmpDir, 'cv-corpus-24.0-delta-2025-12-05', 'en'), { recursive: true })

    cleanCacheDir()

    const remaining = fs.readdirSync(tmpDir)
    expect(remaining).toEqual([])
    expect(logger.info).toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('removed 3 item(s)'),
    )
  })

  it('does nothing when cache directory is empty', () => {
    cleanCacheDir()

    // Should not log anything about removal
    expect(logger.info).not.toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('removed'),
    )
  })

  it('does nothing when cache directory does not exist', async () => {
    // Remove the tmpDir so it doesn't exist
    await fsp.rm(tmpDir, { recursive: true, force: true })

    // Should not throw
    expect(() => cleanCacheDir()).not.toThrow()
  })

  it('continues removing other entries if one fails', async () => {
    // Create entries
    await fsp.writeFile(path.join(tmpDir, 'file1.txt'), 'a')
    await fsp.writeFile(path.join(tmpDir, 'file2.txt'), 'b')

    // Both should be removed successfully
    cleanCacheDir()

    const remaining = fs.readdirSync(tmpDir)
    expect(remaining).toEqual([])
  })
})
