import * as path from 'node:path'

// mock-prefixed variables are accessible inside jest.mock factory (Jest hoisting exception).
const mockRpush  = jest.fn(async (_key: string, ..._vals: string[]) => 1)
const mockExpire = jest.fn(async (_key: string, _ttl: number) => 1)
const mockIncr   = jest.fn(async (_key: string) => 1)
const mockGet    = jest.fn(async (_key: string) => null as string | null)
const mockLrange = jest.fn(async (_key: string, _start: number, _stop: number) => [] as string[])

jest.mock('../infrastructure/redis', () => ({
  redisClient: {
    rpush:  mockRpush,
    expire: mockExpire,
    incr:   mockIncr,
    get:    mockGet,
    lrange: mockLrange,
  },
}))

// Upload chain: uploadToBucket(bucket)(path)(buffer) — mockUploadFn receives the Buffer
const mockUploadTE = jest.fn(async () => ({ _tag: 'Right' as const, right: undefined }))
const mockUploadFn = jest.fn((_buf: Buffer) => mockUploadTE)

jest.mock('../infrastructure/storage', () => ({
  uploadToBucket: jest.fn(() => jest.fn(() => mockUploadFn)),
}))

import { AppEnv, ProblemClip, ProblemClipReason } from '../types'
import { buildProcessLogRow, flushReleaseLogs } from './releaseLogger'

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
// buildProcessLogRow
// ---------------------------------------------------------------------------

describe('buildProcessLogRow', () => {
  it('produces a tab-separated row with all 11 columns', () => {
    const row = buildProcessLogRow(makeEnv({ clipCount: 1000 }), FINISH, 'success')
    expect(row.split('\t')).toHaveLength(11)
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
  beforeEach(() => {
    mockRpush.mockClear()
    mockExpire.mockClear()
    mockIncr.mockClear()
    mockGet.mockClear()
    mockLrange.mockClear()
    mockUploadTE.mockClear()
    mockUploadFn.mockClear()
    // Default: count = 1, total = 100 → no flush
    mockIncr.mockResolvedValue(1)
    mockGet.mockResolvedValue('100')
    mockLrange.mockResolvedValue([])
  })

  it('always pushes a process-log row to the correct Redis key', async () => {
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockRpush).toHaveBeenCalledTimes(1)
    expect(mockRpush.mock.calls[0][0]).toBe(
      'scripted:log:process:cv-corpus-25.0-2026-03-06',
    )
  })

  it('increments the locale counter', async () => {
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockIncr).toHaveBeenCalledWith(
      'scripted:jobs:count:cv-corpus-25.0-2026-03-06',
    )
  })

  it('does not upload to GCS when count is below flush interval and not at total', async () => {
    mockIncr.mockResolvedValue(3)   // 3 < 10, 3 ≠ 100
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).not.toHaveBeenCalled()
  })

  it('uploads to GCS when count reaches FLUSH_INTERVAL (10)', async () => {
    mockIncr.mockResolvedValue(10)
    mockLrange.mockResolvedValue(['row1', 'row2'])
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalledTimes(2) // problem-clips + process-log
  })

  it('uploads to GCS when count equals total (final locale of a run)', async () => {
    mockIncr.mockResolvedValue(5)
    mockGet.mockResolvedValue('5')
    mockLrange.mockResolvedValue(['row1'])
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalled()
  })

  it('skips problem-clips GCS upload when the list is empty', async () => {
    mockIncr.mockResolvedValue(10)
    mockLrange
      .mockResolvedValueOnce([])        // problem-clips list: empty
      .mockResolvedValueOnce(['logrow']) // process-log list
    await flushReleaseLogs(makeEnv(), 'success')
    expect(mockUploadFn).toHaveBeenCalledTimes(1)
  })

  it('process-log TSV starts with the correct header', async () => {
    mockIncr.mockResolvedValue(10)
    mockLrange
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['logrow'])
    await flushReleaseLogs(makeEnv(), 'success')
    const header = (mockUploadFn.mock.calls[0][0] as Buffer).toString('utf-8').split('\n')[0]
    expect(header).toBe(
      'locale\trelease_type\tfinal_path\tstart_timestamp\tfinish_timestamp\tduration_sec\tduration\tnum_clips\tspeed\tstatus\tproblem_clips',
    )
  })

  it('problem-clips TSV starts with the correct header when non-empty', async () => {
    mockIncr.mockResolvedValue(10)
    mockLrange
      .mockResolvedValueOnce(['pc-row'])
      .mockResolvedValueOnce(['log-row'])
    await flushReleaseLogs(makeEnv(), 'success')
    const header = (mockUploadFn.mock.calls[0][0] as Buffer).toString('utf-8').split('\n')[0]
    expect(header).toBe('path\tlocale\treason\tstatus\ttimestamp')
  })

  it('swallows errors without throwing (protects the locale job)', async () => {
    mockRpush.mockRejectedValue(new Error('Redis down'))
    await expect(flushReleaseLogs(makeEnv(), 'success')).resolves.toBeUndefined()
  })
})
