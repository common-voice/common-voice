import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

// mock-prefixed variables are accessible inside jest.mock factory (Jest hoisting exception).
// Captures what was RPUSHed to any Redis key.
const mockRpush = jest.fn(async (_key: string, ..._vals: string[]) => 1)
const mockExpire = jest.fn(async (_key: string, _ttl: number) => 1)

jest.mock('../infrastructure/redis', () => ({
  redisClient: { rpush: mockRpush, expire: mockExpire },
}))

import { AppEnv, ProblemClip, ProblemClipReason } from '../types'
import { runFilterProblemClips, runPushProblemClips } from './problemClips'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TS = '2026-03-06T12:00:00.000Z'

const makeEnv = (
  overrides: Partial<AppEnv> = {},
  releaseDirPath = '/tmp/nonexistent-pctest',
): AppEnv => ({
  type: 'full',
  from: '2020-01-01',
  until: '2026-01-01',
  releaseName: 'cv-corpus-25.0-2026-03-06',
  languages: ['en'],
  locale: 'en',
  releaseDirPath,
  clipsDirPath: path.join(releaseDirPath, 'en', 'clips'),
  releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
  uploadPath: 'cv-corpus-25.0-2026-03-06/cv-corpus-25.0-2026-03-06-en.tar.gz',
  problemClips: [],
  clipCount: 0,
  startTimestamp: TS,
  ...overrides,
})

// ---------------------------------------------------------------------------
// runPushProblemClips
// ---------------------------------------------------------------------------

describe('runPushProblemClips', () => {
  beforeEach(() => {
    mockRpush.mockClear()
    mockExpire.mockClear()
  })

  it('does not RPUSH when problemClips is empty', async () => {
    await runPushProblemClips()(makeEnv())()
    expect(mockRpush).not.toHaveBeenCalled()
  })

  it('does not RPUSH for delta releases (even with problem clips)', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ type: 'delta', problemClips: pc }))()
    expect(mockRpush).not.toHaveBeenCalled()
  })

  it('does not RPUSH for statistics releases (even with problem clips)', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_SHORT, status: 'WARN', timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ type: 'statistics', problemClips: pc }))()
    expect(mockRpush).not.toHaveBeenCalled()
  })

  it('RPUSHes rows when problemClips is non-empty (full release)', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ problemClips: pc }))()
    expect(mockRpush).toHaveBeenCalledTimes(1)
  })

  it('RPUSHes to the correct Redis key for the release', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ problemClips: pc }))()
    const [key] = mockRpush.mock.calls[0]
    expect(key).toBe('scripted:log:problem-clips:cv-corpus-25.0-2026-03-06')
  })

  it('serialises each row as tab-separated path, locale, reason, status, timestamp', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: TS },
      { path: 'b.mp3', locale: 'en', reason: ProblemClipReason.LONG,     status: 'WARN',     timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ problemClips: pc }))()
    const [, ...rows] = mockRpush.mock.calls[0]
    expect(rows).toEqual([
      `a.mp3\ten\tTOO_LONG\tEXCLUDED\t${TS}`,
      `b.mp3\ten\tLONG\tWARN\t${TS}`,
    ])
  })

  it('sets a TTL on the Redis key', async () => {
    const pc: ProblemClip[] = [
      { path: 'a.mp3', locale: 'en', reason: ProblemClipReason.TOO_LONG, status: 'EXCLUDED', timestamp: TS },
    ]
    await runPushProblemClips()(makeEnv({ problemClips: pc }))()
    expect(mockExpire).toHaveBeenCalledTimes(1)
    const [key, ttl] = mockExpire.mock.calls[0]
    expect(key).toBe('scripted:log:problem-clips:cv-corpus-25.0-2026-03-06')
    expect(ttl).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// runFilterProblemClips
// ---------------------------------------------------------------------------

describe('runFilterProblemClips', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filter-test-'))
    fs.mkdirSync(path.join(tmpDir, 'en'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  const writeDurations = (rows: Array<[string, number]>) => {
    const header = 'clip\tduration[ms]'
    const data = rows.map(([c, d]) => `${c}\t${d}`).join('\n')
    fs.writeFileSync(path.join(tmpDir, 'en', 'clip_durations.tsv'), `${header}\n${data}\n`, 'utf-8')
  }

  const writeClipsTsv = (clips: string[]) => {
    const header = 'client_id\tpath\tsentence_id\tsentence\tsentence_domain\tup_votes\tdown_votes\tage\tgender\taccents\tvariant\tlocale\tsegment'
    const rows = clips.map(c => `hash\t${c}\tsid\ttext\t\t1\t0\t\t\t\t\ten\t`)
    fs.writeFileSync(
      path.join(tmpDir, 'en', 'clips.tsv'),
      [header, ...rows].join('\n') + '\n',
      'utf-8',
    )
  }

  it('passes rawDurationInMs through unchanged for delta releases', async () => {
    const env = makeEnv({ type: 'delta' }, tmpDir)
    const result = await runFilterProblemClips(12345)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 12345 })
  })

  it('passes rawDurationInMs through unchanged for statistics releases', async () => {
    const env = makeEnv({ type: 'statistics' }, tmpDir)
    const result = await runFilterProblemClips(99999)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 99999 })
  })

  it('returns rawDurationInMs unchanged when clip_durations.tsv is absent', async () => {
    const env = makeEnv({}, tmpDir)
    const result = await runFilterProblemClips(50000)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 50000 })
  })

  it('classifies DURATION_ZERO clips as EXCLUDED', async () => {
    writeDurations([['a.mp3', 0]])
    const env = makeEnv({ problemClips: [] }, tmpDir)
    await runFilterProblemClips(0)(env)()
    expect(env.problemClips).toEqual([
      expect.objectContaining({
        path: 'a.mp3',
        locale: 'en',
        reason: 'DURATION_ZERO',
        status: 'EXCLUDED',
        timestamp: expect.any(String),
      }),
    ])
  })

  it('classifies TOO_LONG clips (> 30 s) as EXCLUDED and subtracts their duration', async () => {
    writeDurations([['long.mp3', 35000]])
    const env = makeEnv({ problemClips: [] }, tmpDir)
    const result = await runFilterProblemClips(100000)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 65000 }) // 100000 - 35000
    expect(env.problemClips[0]).toMatchObject({
      path: 'long.mp3',
      reason: 'TOO_LONG',
      status: 'EXCLUDED',
      timestamp: expect.any(String),
    })
  })

  it('classifies LONG clips (17 s < duration <= 30 s) as WARN and keeps duration', async () => {
    writeDurations([['long-warn.mp3', 20000]])
    const env = makeEnv({ problemClips: [] }, tmpDir)
    const result = await runFilterProblemClips(100000)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 100000 }) // unchanged
    expect(env.problemClips[0]).toMatchObject({
      path: 'long-warn.mp3',
      reason: 'LONG',
      status: 'WARN',
      timestamp: expect.any(String),
    })
  })

  it('classifies TOO_SHORT clips (0 < duration < 500 ms) as WARN and keeps duration', async () => {
    writeDurations([['short.mp3', 200]])
    const env = makeEnv({ problemClips: [] }, tmpDir)
    const result = await runFilterProblemClips(100000)(env)()
    expect(result).toEqual({ _tag: 'Right', right: 100000 }) // unchanged
    expect(env.problemClips[0]).toMatchObject({
      path: 'short.mp3',
      reason: 'TOO_SHORT',
      status: 'WARN',
      timestamp: expect.any(String),
    })
  })

  it('does not classify clips within normal range', async () => {
    writeDurations([['normal.mp3', 5000]])
    const env = makeEnv({ problemClips: [] }, tmpDir)
    await runFilterProblemClips(100000)(env)()
    expect(env.problemClips).toHaveLength(0)
  })

  it('removes only EXCLUDED clips from clips.tsv; WARN clips are kept', async () => {
    writeDurations([
      ['too-long.mp3', 35000],   // EXCLUDED
      ['long-warn.mp3', 20000],  // WARN — kept
      ['short-warn.mp3', 200],   // WARN — kept
      ['normal.mp3', 5000],      // normal — kept
    ])
    writeClipsTsv(['too-long.mp3', 'long-warn.mp3', 'short-warn.mp3', 'normal.mp3'])

    const env = makeEnv({ problemClips: [] }, tmpDir)
    await runFilterProblemClips(200000)(env)()

    const clipsContent = fs.readFileSync(path.join(tmpDir, 'en', 'clips.tsv'), 'utf-8')
    expect(clipsContent).not.toContain('too-long.mp3')
    expect(clipsContent).toContain('long-warn.mp3')
    expect(clipsContent).toContain('short-warn.mp3')
    expect(clipsContent).toContain('normal.mp3')
  })

  it('does not rewrite clips.tsv when there are no EXCLUDED clips', async () => {
    writeDurations([['normal.mp3', 5000]])
    writeClipsTsv(['normal.mp3'])
    const originalMtime = fs.statSync(path.join(tmpDir, 'en', 'clips.tsv')).mtimeMs

    const env = makeEnv({ problemClips: [] }, tmpDir)
    await runFilterProblemClips(30000)(env)()

    const newMtime = fs.statSync(path.join(tmpDir, 'en', 'clips.tsv')).mtimeMs
    expect(newMtime).toBe(originalMtime)
  })
})
