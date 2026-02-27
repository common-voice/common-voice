import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  filterSourceCounts,
  scanClipsTsv,
  scanSentenceFiles,
  scanLocaleData,
} from './localeData'
import {
  CLIPS_TSV_HEADER,
  makeClipRow,
  toValidatedSentencesTsv,
  toUnvalidatedSentencesTsv,
  makeValidatedSentence,
  makeUnvalidatedSentence,
} from '../test-helpers/tsv'

// -- Temp dir setup ----------------------------------------------------------

let tmpDir: string
let localeDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ld-test-'))
  localeDir = path.join(tmpDir, 'en')
  fs.mkdirSync(localeDir, { recursive: true })
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

// -- filterSourceCounts ------------------------------------------------------

describe('filterSourceCounts', () => {
  it('keeps sources with count >= 5', () => {
    const result = filterSourceCounts({
      Wikipedia: 100,
      Europarl: 50,
    })
    expect(result).toEqual({ Wikipedia: 100, Europarl: 50 })
  })

  it('groups low-count sources under "Other"', () => {
    const result = filterSourceCounts({
      Wikipedia: 100,
      'John Doe': 2,
      'Jane Smith': 3,
    })
    expect(result).toEqual({ Wikipedia: 100, Other: 5 })
  })

  it('excludes empty/blank source keys', () => {
    const result = filterSourceCounts({
      '': 10,
      '  ': 5,
      Wikipedia: 20,
    })
    expect(result).toEqual({ Wikipedia: 20 })
  })

  it('returns empty when all sources are below threshold', () => {
    const result = filterSourceCounts({
      'User A': 1,
      'User B': 2,
    })
    expect(result).toEqual({ Other: 3 })
  })

  it('returns empty for empty input', () => {
    const result = filterSourceCounts({})
    expect(result).toEqual({})
  })

  it('keeps sources at exactly the threshold', () => {
    const result = filterSourceCounts({ Wikipedia: 5 })
    expect(result).toEqual({ Wikipedia: 5 })
  })

  it('does not create "Other" when there are no low-count sources', () => {
    const result = filterSourceCounts({ Wikipedia: 10, Tatoeba: 8 })
    expect(result).not.toHaveProperty('Other')
  })
})

// -- scanClipsTsv ------------------------------------------------------------

describe('scanClipsTsv', () => {
  const writeClips = (rows: string[]) => {
    fs.writeFileSync(
      path.join(localeDir, 'clips.tsv'),
      [CLIPS_TSV_HEADER, ...rows].join('\n'),
    )
  }

  it('counts clips, speakers, and demographics', async () => {
    writeClips([
      makeClipRow({ client_id: 'u1', gender: 'male_masculine', age: 'twenties' }),
      makeClipRow({ client_id: 'u1', gender: 'male_masculine', age: 'twenties' }),
      makeClipRow({ client_id: 'u2', gender: 'female_feminine', age: 'thirties' }),
    ])

    const result = await scanClipsTsv(path.join(localeDir, 'clips.tsv'))()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.clips).toBe(3)
    expect(result.right.speakers).toBe(2)
    expect(result.right.genderCounts).toEqual({
      male_masculine: 2,
      female_feminine: 1,
    })
    expect(result.right.ageCounts).toEqual({
      twenties: 2,
      thirties: 1,
    })
  })

  it('counts variants and accents (skipping blank values)', async () => {
    writeClips([
      makeClipRow({ variant: 'Southern Welsh', accents: 'Welsh English' }),
      makeClipRow({ variant: 'Southern Welsh', accents: '' }),
      makeClipRow({ variant: '', accents: 'Welsh English' }),
    ])

    const result = await scanClipsTsv(path.join(localeDir, 'clips.tsv'))()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.variantCounts).toEqual({ 'Southern Welsh': 2 })
    expect(result.right.accentCounts).toEqual({ 'Welsh English': 2 })
  })

  it('splits comma-separated sentence_domain values', async () => {
    writeClips([
      makeClipRow({ sentence_domain: 'general,healthcare' }),
      makeClipRow({ sentence_domain: 'general' }),
    ])

    const result = await scanClipsTsv(path.join(localeDir, 'clips.tsv'))()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.domainCounts).toEqual({
      general: 2,
      healthcare: 1,
    })
  })

  it('returns error for missing clips.tsv', async () => {
    const result = await scanClipsTsv(
      path.join(localeDir, 'clips.tsv'),
    )()
    expect(result._tag).toBe('Left')
  })

  it('handles header-only clips.tsv', async () => {
    writeClips([])

    const result = await scanClipsTsv(path.join(localeDir, 'clips.tsv'))()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.clips).toBe(0)
    expect(result.right.speakers).toBe(0)
    expect(result.right.variantCounts).toEqual({})
    expect(result.right.domainCounts).toEqual({})
  })
})

// -- scanSentenceFiles -------------------------------------------------------

describe('scanSentenceFiles', () => {
  it('counts validated sentences and extracts source + variant', async () => {
    fs.writeFileSync(
      path.join(localeDir, 'validated_sentences.tsv'),
      toValidatedSentencesTsv([
        makeValidatedSentence({ source: 'Wikipedia', variant: 'Southern Welsh' }),
        makeValidatedSentence({ source: 'Wikipedia', variant: 'Southern Welsh' }),
        makeValidatedSentence({ source: 'Tatoeba', variant: 'Northern Welsh' }),
      ]),
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.validatedSentences).toBe(3)
    expect(result.right.sourceCounts).toEqual({
      // Both below threshold of 5 — grouped under Other
      Other: 3,
    })
    expect(result.right.sentenceVariantCounts).toEqual({
      'Southern Welsh': 2,
      'Northern Welsh': 1,
    })
  })

  it('extracts status breakdown from unvalidated sentences', async () => {
    fs.writeFileSync(
      path.join(localeDir, 'unvalidated_sentences.tsv'),
      toUnvalidatedSentencesTsv([
        makeUnvalidatedSentence({ status: 'rejected' }),
        makeUnvalidatedSentence({ status: 'rejected' }),
        makeUnvalidatedSentence({ status: 'pending' }),
        makeUnvalidatedSentence({ status: 'pending' }),
        makeUnvalidatedSentence({ status: 'pending' }),
      ]),
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.unvalidatedSentences).toBe(5)
    expect(result.right.rejectedSentences).toBe(2)
    expect(result.right.pendingSentences).toBe(3)
  })

  it('merges variant counts from both sentence TSVs', async () => {
    fs.writeFileSync(
      path.join(localeDir, 'validated_sentences.tsv'),
      toValidatedSentencesTsv([
        makeValidatedSentence({ variant: 'Welsh' }),
        makeValidatedSentence({ variant: 'Welsh' }),
      ]),
    )
    fs.writeFileSync(
      path.join(localeDir, 'unvalidated_sentences.tsv'),
      toUnvalidatedSentencesTsv([
        makeUnvalidatedSentence({ variant: 'Welsh' }),
        makeUnvalidatedSentence({ variant: 'Scots' }),
      ]),
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.sentenceVariantCounts).toEqual({
      Welsh: 3,
      Scots: 1,
    })
  })

  it('filters sources by threshold (>= 5 kept, rest grouped)', async () => {
    const rows = [
      ...Array.from({ length: 10 }, () =>
        makeValidatedSentence({ source: 'Wikipedia' }),
      ),
      ...Array.from({ length: 6 }, () =>
        makeValidatedSentence({ source: 'Europarl' }),
      ),
      makeValidatedSentence({ source: 'John Doe' }),
      makeValidatedSentence({ source: 'Jane Smith' }),
    ]
    fs.writeFileSync(
      path.join(localeDir, 'validated_sentences.tsv'),
      toValidatedSentencesTsv(rows),
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.sourceCounts['Wikipedia']).toBe(10)
    expect(result.right.sourceCounts['Europarl']).toBe(6)
    expect(result.right.sourceCounts['Other']).toBe(2)
    expect(result.right.sourceCounts['John Doe']).toBeUndefined()
  })

  it('counts reported sentences from reported.tsv line count', async () => {
    const header = 'sentence_id\tsentence\tlocale\treason\n'
    const row = 'sid1\tBad sentence\ten\toffensive\n'
    fs.writeFileSync(
      path.join(localeDir, 'reported.tsv'),
      header + row + row + row,
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.reportedSentences).toBe(3)
  })

  it('returns zeros when no sentence files exist', async () => {
    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.validatedSentences).toBe(0)
    expect(result.right.unvalidatedSentences).toBe(0)
    expect(result.right.rejectedSentences).toBe(0)
    expect(result.right.pendingSentences).toBe(0)
    expect(result.right.reportedSentences).toBe(0)
    expect(result.right.sourceCounts).toEqual({})
    expect(result.right.sentenceVariantCounts).toEqual({})
  })

  it('skips blank variant values', async () => {
    fs.writeFileSync(
      path.join(localeDir, 'validated_sentences.tsv'),
      toValidatedSentencesTsv([
        makeValidatedSentence({ variant: '' }),
        makeValidatedSentence({ variant: 'Welsh' }),
      ]),
    )

    const result = await scanSentenceFiles(localeDir)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.sentenceVariantCounts).toEqual({ Welsh: 1 })
  })
})

// -- scanLocaleData (orchestrator) -------------------------------------------

describe('scanLocaleData', () => {
  const writeFullLocale = () => {
    // clips.tsv
    fs.writeFileSync(
      path.join(localeDir, 'clips.tsv'),
      [
        CLIPS_TSV_HEADER,
        makeClipRow({ client_id: 'u1', gender: 'male_masculine', age: 'twenties', variant: 'v1', sentence_domain: 'general' }),
        makeClipRow({ client_id: 'u2', gender: 'female_feminine', age: 'thirties', variant: '', sentence_domain: 'healthcare' }),
      ].join('\n'),
    )

    // CC output files
    const ccHeader = 'client_id\tpath\tsentence\n'
    const ccRow = 'u1\tclip1.mp3\tHello\n'
    fs.writeFileSync(path.join(localeDir, 'train.tsv'), ccHeader + ccRow.repeat(10))
    fs.writeFileSync(path.join(localeDir, 'dev.tsv'), ccHeader + ccRow.repeat(3))
    fs.writeFileSync(path.join(localeDir, 'test.tsv'), ccHeader + ccRow.repeat(3))
    fs.writeFileSync(path.join(localeDir, 'validated.tsv'), ccHeader + ccRow.repeat(15))
    fs.writeFileSync(path.join(localeDir, 'invalidated.tsv'), ccHeader + ccRow)
    fs.writeFileSync(path.join(localeDir, 'other.tsv'), ccHeader)

    // Sentence files
    fs.writeFileSync(
      path.join(localeDir, 'validated_sentences.tsv'),
      toValidatedSentencesTsv([
        makeValidatedSentence({ sentence: 'Sentence 1', source: 'Wikipedia' }),
        makeValidatedSentence({ sentence: 'Sentence 2', source: 'Wikipedia' }),
      ]),
    )
    fs.writeFileSync(
      path.join(localeDir, 'unvalidated_sentences.tsv'),
      toUnvalidatedSentencesTsv([
        makeUnvalidatedSentence({ status: 'pending' }),
        makeUnvalidatedSentence({ status: 'rejected' }),
      ]),
    )
    const reportedHeader = 'sentence_id\tsentence\tlocale\treason\n'
    fs.writeFileSync(
      path.join(localeDir, 'reported.tsv'),
      reportedHeader + 'sid1\tBad\ten\toffensive\n',
    )
  }

  it('produces a complete LocaleReleaseData', async () => {
    writeFullLocale()
    const totalDurationMs = 7_200_000 // 2 hours

    const result = await scanLocaleData(localeDir, totalDurationMs)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return
    const data = result.right

    // Clips scan
    expect(data.clips).toBe(2)
    expect(data.speakers).toBe(2)
    expect(data.genderCounts).toEqual({ male_masculine: 1, female_feminine: 1 })
    expect(data.variantCounts).toEqual({ v1: 1 })
    expect(data.domainCounts).toEqual({ general: 1, healthcare: 1 })

    // CC buckets
    expect(data.buckets.train).toBe(10)
    expect(data.buckets.dev).toBe(3)
    expect(data.buckets.test).toBe(3)
    expect(data.buckets.validated).toBe(15)
    expect(data.buckets.invalidated).toBe(1)
    expect(data.buckets.other).toBe(0)

    // Sentence scan
    expect(data.validatedSentences).toBe(2)
    expect(data.unvalidatedSentences).toBe(2)
    expect(data.rejectedSentences).toBe(1)
    expect(data.pendingSentences).toBe(1)
    expect(data.reportedSentences).toBe(1)

    // Duration
    expect(data.totalDurationMs).toBe(7_200_000)
    expect(data.totalHrs).toBe(2)
    expect(data.avgDurationSecs).toBe(3600) // 7200000ms / 2 clips / 1000
    // validDurationSecs = round(avgDurationMs * validated) / 1000
    // avgDurationMs = 7200000/2 = 3600000, validated = 15
    // round(3600000 * 15) / 1000 = 54000000 / 1000 = 54000
    expect(data.validDurationSecs).toBe(54_000)

    // Sentence sample (should exist since we wrote validated_sentences.tsv)
    expect(data.sentencesSample.length).toBeGreaterThan(0)
  })

  it('returns error when clips.tsv is missing', async () => {
    // No files written at all
    const result = await scanLocaleData(localeDir, 0)()
    expect(result._tag).toBe('Left')
  })

  it('handles zero duration gracefully', async () => {
    fs.writeFileSync(
      path.join(localeDir, 'clips.tsv'),
      CLIPS_TSV_HEADER + '\n',
    )

    const result = await scanLocaleData(localeDir, 0)()
    expect(result._tag).toBe('Right')
    if (result._tag !== 'Right') return

    expect(result.right.clips).toBe(0)
    expect(result.right.avgDurationSecs).toBe(0)
    expect(result.right.totalHrs).toBe(0)
  })
})
