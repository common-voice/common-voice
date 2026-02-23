import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { ProcessLocaleJob, VariantInfo } from '../types'
import {
  filterClipsTsvForVariant,
  filterClipDurationsForVariant,
  deriveVariantEnv,
  rewriteLocaleColumn,
} from './processVariants'
import { TSV_COLUMNS } from '../core/clips'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TS = '2026-03-06T12:00:00.000Z'

const CLIPS_HEADER = TSV_COLUMNS.join('\t')

const makeClipsRow = (
  clipPath: string,
  variantName: string,
  locale = 'cy',
) =>
  `hash\t${clipPath}\tsid\ttext\t\t1\t0\t\t\t\t${variantName}\t${locale}\t`

const DURATIONS_HEADER = 'clip\tduration[ms]'

const makeJob = (overrides: Partial<ProcessLocaleJob> = {}): ProcessLocaleJob => ({
  type: 'variants',
  from: '2000-01-01',
  until: '2026-03-06',
  releaseName: 'cv-corpus-25.0-2026-03-06',
  languages: [],
  locale: 'cy',
  variants: [
    { variantToken: 'southwes', variantName: 'Southern Welsh', clipCount: 100 },
    { variantToken: 'northwes', variantName: 'Northern Welsh', clipCount: 50 },
  ],
  ...overrides,
})

// ---------------------------------------------------------------------------
// filterClipsTsvForVariant
// ---------------------------------------------------------------------------

describe('filterClipsTsvForVariant', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'variant-filter-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('filters clips matching the variant name', async () => {
    const srcPath = path.join(tmpDir, 'clips.tsv')
    const dstPath = path.join(tmpDir, 'out', 'clips.tsv')

    const content = [
      CLIPS_HEADER,
      makeClipsRow('a.mp3', 'Southern Welsh'),
      makeClipsRow('b.mp3', 'Northern Welsh'),
      makeClipsRow('c.mp3', 'Southern Welsh'),
    ].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    const count = await filterClipsTsvForVariant(srcPath, dstPath, 'Southern Welsh', 'cy-southwes')
    expect(count).toBe(2)

    const result = fs.readFileSync(dstPath, 'utf-8')
    expect(result).toContain('a.mp3')
    expect(result).toContain('c.mp3')
    expect(result).not.toContain('b.mp3')
  })

  it('rewrites locale column to compound locale', async () => {
    const srcPath = path.join(tmpDir, 'clips.tsv')
    const dstPath = path.join(tmpDir, 'out', 'clips.tsv')

    const content = [
      CLIPS_HEADER,
      makeClipsRow('a.mp3', 'Southern Welsh', 'cy'),
    ].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    await filterClipsTsvForVariant(srcPath, dstPath, 'Southern Welsh', 'cy-southwes')

    const result = fs.readFileSync(dstPath, 'utf-8')
    const dataLine = result.split('\n')[1]
    const cols = dataLine.split('\t')
    expect(cols[11]).toBe('cy-southwes') // locale column rewritten
  })

  it('returns 0 when no clips match', async () => {
    const srcPath = path.join(tmpDir, 'clips.tsv')
    const dstPath = path.join(tmpDir, 'out', 'clips.tsv')

    const content = [
      CLIPS_HEADER,
      makeClipsRow('a.mp3', 'Northern Welsh'),
    ].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    const count = await filterClipsTsvForVariant(srcPath, dstPath, 'Southern Welsh', 'cy-southwes')
    expect(count).toBe(0)
  })

  it('preserves the header in the output', async () => {
    const srcPath = path.join(tmpDir, 'clips.tsv')
    const dstPath = path.join(tmpDir, 'out', 'clips.tsv')

    const content = [
      CLIPS_HEADER,
      makeClipsRow('a.mp3', 'Southern Welsh'),
    ].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    await filterClipsTsvForVariant(srcPath, dstPath, 'Southern Welsh', 'cy-southwes')

    const result = fs.readFileSync(dstPath, 'utf-8')
    expect(result.split('\n')[0]).toBe(CLIPS_HEADER)
  })
})

// ---------------------------------------------------------------------------
// filterClipDurationsForVariant
// ---------------------------------------------------------------------------

describe('filterClipDurationsForVariant', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dur-filter-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('filters durations to matching clips and returns total duration', async () => {
    const srcPath = path.join(tmpDir, 'clip_durations.tsv')
    const dstPath = path.join(tmpDir, 'out_durations.tsv')

    const content = [
      DURATIONS_HEADER,
      'a.mp3\t5000',
      'b.mp3\t3000',
      'c.mp3\t7000',
    ].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    const matching = new Set(['a.mp3', 'c.mp3'])
    const totalMs = await filterClipDurationsForVariant(srcPath, dstPath, matching)

    expect(totalMs).toBe(12000) // 5000 + 7000
    const result = fs.readFileSync(dstPath, 'utf-8')
    expect(result).toContain('a.mp3')
    expect(result).toContain('c.mp3')
    expect(result).not.toContain('b.mp3')
  })

  it('returns 0 when source file does not exist', async () => {
    const dstPath = path.join(tmpDir, 'out_durations.tsv')
    const totalMs = await filterClipDurationsForVariant(
      '/nonexistent/clip_durations.tsv',
      dstPath,
      new Set(['a.mp3']),
    )
    expect(totalMs).toBe(0)
  })

  it('returns 0 when no clips match', async () => {
    const srcPath = path.join(tmpDir, 'clip_durations.tsv')
    const dstPath = path.join(tmpDir, 'out_durations.tsv')

    const content = [DURATIONS_HEADER, 'a.mp3\t5000'].join('\n') + '\n'
    fs.writeFileSync(srcPath, content, 'utf-8')

    const totalMs = await filterClipDurationsForVariant(srcPath, dstPath, new Set(['b.mp3']))
    expect(totalMs).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// deriveVariantEnv
// ---------------------------------------------------------------------------

describe('deriveVariantEnv', () => {
  const variant: VariantInfo = {
    variantToken: 'southwes',
    variantName: 'Southern Welsh',
    clipCount: 100,
  }

  it('sets locale to compound locale', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.locale).toBe('cy-southwes')
  })

  it('sets releaseName to effective name with -variants suffix', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.releaseName).toBe('cv-corpus-25.0-2026-03-06-variants')
  })

  it('sets type to variants', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.type).toBe('variants')
  })

  it('uses base releaseName in tarball filename for short naming', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    // uploadPath directory uses effective name, filename uses base name
    expect(env.uploadPath).toBe(
      'cv-corpus-25.0-2026-03-06-variants/cv-corpus-25.0-2026-03-06-cy-southwes.tar.gz',
    )
  })

  it('sets releaseDirPath using effective release name', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.releaseDirPath).toBe('/cache/cv-corpus-25.0-2026-03-06-variants')
  })

  it('sets clipsDirPath for compound locale', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.clipsDirPath).toBe(
      '/cache/cv-corpus-25.0-2026-03-06-variants/cy-southwes/clips',
    )
  })

  it('initialises problemClips as empty array', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.problemClips).toEqual([])
  })

  it('initialises clipCount as 0', () => {
    const env = deriveVariantEnv(makeJob(), variant, '/cache')
    expect(env.clipCount).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// rewriteLocaleColumn
// ---------------------------------------------------------------------------

describe('rewriteLocaleColumn', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rewrite-locale-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('rewrites locale column from compound back to original', () => {
    const header = 'client_id\tpath\tsentence_id\tsentence\tsentence_domain\tup_votes\tdown_votes\tage\tgender\taccents\tvariant\tlocale\tsegment'
    const row = 'hash\ta.mp3\tsid\ttext\t\t1\t0\t\t\t\tSouthern Welsh\tcy-southwes\t'
    const content = [header, row].join('\n') + '\n'
    fs.writeFileSync(path.join(tmpDir, 'validated.tsv'), content, 'utf-8')

    rewriteLocaleColumn(tmpDir, ['validated.tsv'], 'cy-southwes', 'cy')

    const result = fs.readFileSync(path.join(tmpDir, 'validated.tsv'), 'utf-8')
    const dataLine = result.split('\n')[1]
    const cols = dataLine.split('\t')
    expect(cols[11]).toBe('cy') // locale column restored
  })

  it('skips files that do not exist', () => {
    // Should not throw
    expect(() =>
      rewriteLocaleColumn(tmpDir, ['nonexistent.tsv'], 'cy-southwes', 'cy'),
    ).not.toThrow()
  })

  it('skips files without a locale column', () => {
    const content = 'clip\tduration[ms]\na.mp3\t5000\n'
    fs.writeFileSync(path.join(tmpDir, 'clip_durations.tsv'), content, 'utf-8')

    rewriteLocaleColumn(tmpDir, ['clip_durations.tsv'], 'cy-southwes', 'cy')

    const result = fs.readFileSync(path.join(tmpDir, 'clip_durations.tsv'), 'utf-8')
    expect(result).toBe(content) // unchanged
  })

  it('processes multiple files', () => {
    const header = 'client_id\tpath\tsentence_id\tsentence\tsentence_domain\tup_votes\tdown_votes\tage\tgender\taccents\tvariant\tlocale\tsegment'
    const row = 'hash\ta.mp3\tsid\ttext\t\t1\t0\t\t\t\tSouthern Welsh\tcy-southwes\t'
    const content = [header, row].join('\n') + '\n'

    fs.writeFileSync(path.join(tmpDir, 'validated.tsv'), content, 'utf-8')
    fs.writeFileSync(path.join(tmpDir, 'train.tsv'), content, 'utf-8')

    rewriteLocaleColumn(tmpDir, ['validated.tsv', 'train.tsv'], 'cy-southwes', 'cy')

    for (const file of ['validated.tsv', 'train.tsv']) {
      const result = fs.readFileSync(path.join(tmpDir, file), 'utf-8')
      const cols = result.split('\n')[1].split('\t')
      expect(cols[11]).toBe('cy')
    }
  })
})
