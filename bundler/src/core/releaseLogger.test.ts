import * as path from 'node:path'

jest.mock('../infrastructure/redis')
jest.mock('../infrastructure/storage')
jest.mock('../infrastructure/queue')

import { redisClient } from '../infrastructure/redis'
import { uploadToBucket } from '../infrastructure/storage'

const mockRedis = redisClient as jest.Mocked<typeof redisClient>

// Upload chain: uploadToBucket(bucket)(path)(buffer) -- mockPathFn captures GCS path
const mockUploadTE = jest.fn(async () => ({ _tag: 'Right' as const, right: undefined }))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUploadFn = jest.fn((_buf: Buffer) => mockUploadTE)
const mockPathFn = jest.fn(() => mockUploadFn)
;(uploadToBucket as jest.Mock).mockReturnValue(mockPathFn)

import { AppEnv, ProblemClip, ProblemClipReason } from '../types'
import {
  buildProcessLogRow,
  flushReleaseLogs,
  formatRunTimestamp,
} from './releaseLogger'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const START  = '2026-03-06T10:00:00.000Z'
const FINISH = '2026-03-06T10:01:05.500Z'  // 65.5 s after START

const makeEnv = (overrides: Partial<AppEnv> = {}): AppEnv => ({
  type: 'full',
  from: '2020-01-01',
  until: '2026-01-01',
  releaseName: 'cv-corpus-25.0-2026-03-06',
  languages: ['en'],
  locale: 'en',
  releaseDirPath: '/tmp/test',
  clipsDirPath: path.join('/tmp/test', 'en', 'clips'),
  releaseTarballsDirPath: path.join('/tmp/test', 'tarballs'),
  uploadPath: 'cv-corpus-25.0-2026-03-06/cv-corpus-25.0-2026-03-06-en.tar.gz',
  problemClips: [],
  clipCount: 0,
  startTimestamp: START,
  ...overrides,
})

// ---------------------------------------------------------------------------
// formatRunTimestamp
// ---------------------------------------------------------------------------

describe('formatRunTimestamp', () => {
  it('formats an ISO timestamp into YYYYMMDDTHHmmss', () => {
    expect(formatRunTimestamp('2026-03-22T14:30:05.123Z')).toBe('20260322T143005')
  })

  it('handles midnight correctly', () => {
    expect(formatRunTimestamp('2026-01-01T00:00:00.000Z')).toBe('20260101T000000')
  })

  it('falls back to current time when input is null', () => {
    const result = formatRunTimestamp(null)
    expect(result).toMatch(/^\d{8}T\d{6}$/)
  })

  it('falls back to current time when input is undefined', () => {
    const result = formatRunTimestamp(undefined)
    expect(result).toMatch(/^\d{8}T\d{6}$/)
  })

  it('falls back to current time when input is an invalid date string', () => {
    const result = formatRunTimestamp('not-a-date')
    expect(result).toMatch(/^\d{8}T\d{6}$/)
  })
})

// ---------------------------------------------------------------------------
// buildProcessLogRow
// ---------------------------------------------------------------------------

describe('buildProcessLogRow', () => {
  it('produces a tab-separated row with all 12 columns', () => {
    const row = buildProcessLogRow(makeEnv({ clipCount: 1000 }), FINISH, 'success')
    expect(row.split('\t')).toHaveLength(12)
  })

  it('first column is locale', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')[0]).toBe('en')
  })

  it('second column is release_type', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')[1]).toBe('full')
    expect(buildProcessLogRow(makeEnv({ type: 'delta' }), FINISH, 'success').split('\t')[1]).toBe('delta')
  })

  it('third column is final_path (precomputed uploadPath)', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')[2]).toBe(
      'cv-corpus-25.0-2026-03-06/cv-corpus-25.0-2026-03-06-en.tar.gz',
    )
  })

  it('contains start and finish timestamps', () => {
    const cols = buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')
    expect(cols[3]).toBe(START)
    expect(cols[4]).toBe(FINISH)
  })

  it('computes duration_sec correctly (65.50 s)', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')[5]).toBe('65.50')
  })

  it('computes duration as dd:hh:mm:ss (00:00:01:05)', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'success').split('\t')[6]).toBe('00:00:01:05')
  })

  it('includes num_clips from env.clipCount', () => {
    expect(buildProcessLogRow(makeEnv({ clipCount: 1234 }), FINISH, 'success').split('\t')[7]).toBe('1234')
  })

  it('computes speed as clips per second', () => {
    // 1000 clips / 65.5 s ≈ 15.27
    const speed = parseFloat(
      buildProcessLogRow(makeEnv({ clipCount: 1000 }), FINISH, 'success').split('\t')[8],
    )
    expect(speed).toBeCloseTo(15.27, 1)
  })

  it('includes status column', () => {
    expect(buildProcessLogRow(makeEnv(), FINISH, 'error').split('\t')[9]).toBe('error')
  })

  it('includes problem_clips count', () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: START },
      { path: 'b.mp3', locale: 'en', reason: ProblemClipReason.LONG,     status: 'WARN',     timestamp: START },
    ]
    expect(buildProcessLogRow(makeEnv({ problemClips: pc }), FINISH, 'success').split('\t')[10]).toBe('2')
  })

  it('returns 0.00 speed when start equals finish', () => {
    expect(buildProcessLogRow(makeEnv({ clipCount: 100 }), START, 'success').split('\t')[8]).toBe('0.00')
  })
})

// ---------------------------------------------------------------------------
// flushReleaseLogs
// ---------------------------------------------------------------------------

describe('flushReleaseLogs', () => {
  const TIME_START = '2026-03-06T10:00:00.000Z'
  const RUN_TS = '20260306T100000' // expected formatRunTimestamp(TIME_START)

  beforeEach(() => {
    mockRedis.rpush.mockClear()
    mockRedis.expire.mockClear()
    mockRedis.incr.mockClear()
    mockRedis.incrby.mockClear()
    mockRedis.get.mockClear()
    mockRedis.set.mockClear()
    mockRedis.lrange.mockClear()
    mockUploadTE.mockClear()
    mockUploadFn.mockClear()
    mockPathFn.mockClear()
    // Default: count = 1, total = 100 -> no flush
    mockRedis.incr.mockResolvedValue(1)
    // Return '100' for totals, TIME_START for timeStart, null for lastFlush
    mockRedis.get.mockImplementation(async (key) => {
      if (key.includes('last-flush')) return null
      if (key.includes('time:start')) return TIME_START
      return '100'
    })
    mockRedis.lrange.mockResolvedValue([])
  })

  it('always pushes a process-log row to the correct Redis key', async () => {
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockRedis.rpush).toHaveBeenCalledTimes(1)
    expect(mockRedis.rpush.mock.calls[0][0]).toBe(
      'scripted:log:process:cv-corpus-25.0-2026-03-06',
    )
  })

  it('increments the locale counter', async () => {
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockRedis.incr).toHaveBeenCalledWith(
      'scripted:jobs:count:cv-corpus-25.0-2026-03-06',
    )
  })

  it('increments the clips counter by env.clipCount', async () => {
    await flushReleaseLogs(makeEnv({ clipCount: 4200 }), 'success')
    expect(mockRedis.incrby).toHaveBeenCalledWith(
      'scripted:clips:count:cv-corpus-25.0-2026-03-06',
      4200,
    )
  })

  it('does not upload to GCS when count is below flush interval and not at total', async () => {
    mockRedis.incr.mockResolvedValue(3)   // 3 < 10, 3 ≠ 100
    // Recent flush -- prevents time-based trigger from firing
    mockRedis.get.mockImplementation(async (key) => {
      if (key.includes('last-flush')) return new Date().toISOString()
      if (key.includes('time:start')) return TIME_START
      return '100'
    })
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).not.toHaveBeenCalled()
  })

  it('uploads to GCS when count reaches FLUSH_INTERVAL (10)', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange.mockResolvedValue(['row1', 'row2'])
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalledTimes(2) // problem-clips + process-log
  })

  it('uploads to GCS when count equals total (final locale of a run)', async () => {
    mockRedis.incr.mockResolvedValue(5)
    mockRedis.get.mockImplementation(async (key) => {
      if (key.includes('last-flush')) return new Date().toISOString()
      if (key.includes('time:start')) return TIME_START
      return '5'
    })
    mockRedis.lrange.mockResolvedValue(['row1'])
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalled()
  })

  it('skips problem-clips GCS upload when the list is empty', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange
      .mockResolvedValueOnce([])        // problem-clips list: empty
      .mockResolvedValueOnce(['logrow']) // process-log list
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalledTimes(1)
  })

  it('process-log TSV starts with the correct header', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['logrow'])
    await flushReleaseLogs(makeEnv(), 'success')
    const header = (mockUploadFn.mock.calls[0][0] as Buffer).toString('utf-8').split('\n')[0]
    expect(header).toBe(
      'locale\trelease_type\tfinal_path\tstart_timestamp\tfinish_timestamp\tduration_sec\tduration\tnum_clips\tspeed\tstatus\tproblem_clips\terror_message',
    )
  })

  it('problem-clips TSV starts with the correct header when non-empty', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange
      .mockResolvedValueOnce(['pc-row'])
      .mockResolvedValueOnce(['log-row'])
    await flushReleaseLogs(makeEnv(), 'success')
    const header = (mockUploadFn.mock.calls[0][0] as Buffer).toString('utf-8').split('\n')[0]
    expect(header).toBe('path\tlocale\treason\tstatus\ttimestamp\tvalue')
  })

  it('uploads process-log to a timestamped GCS path', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange
      .mockResolvedValueOnce([])          // problem-clips: empty
      .mockResolvedValueOnce(['logrow'])   // process-log
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockPathFn).toHaveBeenCalledWith(
      `cv-corpus-25.0-2026-03-06/logs/process-log-${RUN_TS}.tsv`,
    )
  })

  it('uploads problem-clips to a timestamped GCS path', async () => {
    mockRedis.incr.mockResolvedValue(10)
    mockRedis.lrange.mockResolvedValue(['row1'])
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockPathFn).toHaveBeenCalledWith(
      `cv-corpus-25.0-2026-03-06/logs/problem-clips-${RUN_TS}.tsv`,
    )
    expect(mockPathFn).toHaveBeenCalledWith(
      `cv-corpus-25.0-2026-03-06/logs/process-log-${RUN_TS}.tsv`,
    )
  })

  it('swallows errors without throwing (protects the locale job)', async () => {
    mockRedis.rpush.mockRejectedValue(new Error('Redis down'))
    await expect(flushReleaseLogs(makeEnv(), 'success')).resolves.toBeUndefined()
  })
})
