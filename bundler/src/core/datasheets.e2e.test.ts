import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  extractAutoStats,
  sampleSentences,
  buildReplacementMap,
  fillTemplate,
} from './datasheets'
import { fetchDatasheetsPayloads } from '../infrastructure/datasheetsFetcher'
import { CLIPS_TSV_ROW, TSV_COLUMNS } from './clips'
import { DatasheetLocalePayload, ValidatedSentence } from '../types'

// ---------------------------------------------------------------------------
// TSV serialisation helpers -- use types as source of truth for column layout
// ---------------------------------------------------------------------------

const toClipsTsv = (rows: CLIPS_TSV_ROW[]): string => {
  const header = TSV_COLUMNS.join('\t')
  const dataRows = rows.map(row => TSV_COLUMNS.map(col => row[col]).join('\t'))
  return [header, ...dataRows].join('\n')
}

const VALIDATED_SENTENCES_COLS: (keyof ValidatedSentence)[] = [
  'sentence_id',
  'sentence',
  'variant',
  'sentence_domain',
  'source',
  'is_used',
  'clips_count',
]

const toValidatedSentencesTsv = (rows: ValidatedSentence[]): string => {
  const header = VALIDATED_SENTENCES_COLS.join('\t')
  const dataRows = rows.map(row =>
    VALIDATED_SENTENCES_COLS.map(col => row[col]).join('\t'),
  )
  return [header, ...dataRows].join('\n')
}

// ---------------------------------------------------------------------------
// Deterministic fixture builders
// ---------------------------------------------------------------------------

const AGES = [
  'teens',
  'twenties',
  'thirties',
  'fourties',
  'fifties',
  '',
] as const
const GENDERS = ['male_masculine', 'female_feminine', 'non-binary', ''] as const

const makeClipRow = (i: number, locale: string): CLIPS_TSV_ROW => ({
  client_id: `user${i % 20}`,
  path: `clips/clip${i}.mp3`,
  sentence_id: `s${i % 50}`,
  sentence: `Sentence number ${i % 50} in ${locale}`,
  sentence_domain: 'general',
  up_votes: String(i % 5),
  down_votes: '0',
  age: AGES[i % AGES.length],
  gender: GENDERS[i % GENDERS.length],
  accents: '',
  variant: '',
  locale,
  segment: '',
})

const makeValidatedSentenceRow = (
  i: number,
  locale: string,
  isUsed: '0' | '1',
): ValidatedSentence => ({
  sentence_id: `s${i}`,
  sentence: `Sentence number ${i} in ${locale}`,
  variant: '',
  sentence_domain: 'general',
  source: 'wiki',
  is_used: isUsed,
  clips_count: isUsed === '1' ? String((i % 5) + 1) : '0',
})

const setupLocale = (
  tmpDir: string,
  locale: string,
  clipCount: number,
  sentenceCount: number,
  usedCount: number,
): void => {
  const localeDir = path.join(tmpDir, locale)
  fs.mkdirSync(localeDir, { recursive: true })

  fs.writeFileSync(
    path.join(localeDir, 'clips.tsv'),
    toClipsTsv(
      Array.from({ length: clipCount }, (_, i) => makeClipRow(i, locale)),
    ),
  )

  fs.writeFileSync(
    path.join(localeDir, 'validated_sentences.tsv'),
    toValidatedSentencesTsv(
      Array.from({ length: sentenceCount }, (_, i) =>
        makeValidatedSentenceRow(i, locale, i < usedCount ? '1' : '0'),
      ),
    ),
  )

  // validated.tsv: only the line count matters for validatedClips
  const validatedCount = Math.floor(clipCount * 0.8)
  fs.writeFileSync(
    path.join(localeDir, 'validated.tsv'),
    [
      'header',
      ...Array.from({ length: validatedCount }, (_, i) => `row${i}`),
    ].join('\n'),
  )
}

// ---------------------------------------------------------------------------
// Test configuration
// ---------------------------------------------------------------------------

// Full URL to the datasheets JSON on GitHub. Points to the dev branch until
// it is merged to main, at which point a plain filename suffices and
// DATASHEETS_BASE_URL in config.ts will resolve it.
// Override via DATASHEETS_FILE env var (filename or full https:// URL).
const RELEASE_ID = '25.0-2026-03-06'
const DATASHEETS_FILE =
  process.env.DATASHEETS_FILE ||
  `https://raw.githubusercontent.com/common-voice/cv-datasheets/1540-pre-compile-release-data-to-json/releases/datasheets-${RELEASE_ID}.json`

const RELEASE_NAME = `cv-corpus-${RELEASE_ID}`

// Skip in CI environments -- this test makes a live network request to GitHub
// and relies on a feature branch URL that changes over time.
// Run locally with: npm test -- --testPathPatterns=datasheets.e2e
const describeE2E = process.env.CI ? describe.skip : describe

// Network requests can be slow -- increase timeout for the whole suite.
jest.setTimeout(30_000)

type TestLocale = {
  locale: string
  nativeName: string
  clipCount: number
  sentenceCount: number
  usedCount: number
}

const TEST_LOCALES: TestLocale[] = [
  // en: large dataset, rich community fields
  {
    locale: 'en',
    nativeName: 'English',
    clipCount: 200,
    sentenceCount: 100,
    usedCount: 80,
  },
  // tr: medium-sized language
  {
    locale: 'tr',
    nativeName: 'Türkçe',
    clipCount: 80,
    sentenceCount: 40,
    usedCount: 35,
  },
  // kbd: small minority language -- tests graceful handling of sparse data
  {
    locale: 'kbd',
    nativeName: 'Адыгэбзэ',
    clipCount: 15,
    sentenceCount: 10,
    usedCount: 10,
  },
]

// ---------------------------------------------------------------------------
// E2E suite
// ---------------------------------------------------------------------------

describeE2E('Datasheet e2e generation', () => {
  let tmpDir: string
  let payloads: Map<string, DatasheetLocalePayload>

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-e2e-'))
    console.log(`[datasheets e2e] output dir: ${tmpDir}`)

    for (const {
      locale,
      clipCount,
      sentenceCount,
      usedCount,
    } of TEST_LOCALES) {
      setupLocale(tmpDir, locale, clipCount, sentenceCount, usedCount)
    }

    // Fetch from GitHub raw URL (resolved inside fetchDatasheetsPayloads)
    const result = await fetchDatasheetsPayloads('scripted', DATASHEETS_FILE)()
    if (result._tag === 'Left') throw result.left
    payloads = result.right
  })

  // No afterAll cleanup -- output dir is left in /tmp for manual inspection.
  // The OS reclaims /tmp on reboot.

  it('loads payloads for all test locales from GitHub', () => {
    for (const { locale } of TEST_LOCALES) {
      expect(payloads.has(locale)).toBe(true)
    }
    // Sanity: we should have payloads for many locales, not just the test set
    expect(payloads.size).toBeGreaterThan(50)
  })

  it.each(TEST_LOCALES)(
    'produces a valid datasheet for $locale ($nativeName)',
    async ({ locale, nativeName, clipCount, usedCount }) => {
      const payload = payloads.get(locale)
      expect(payload).toBeDefined()
      if (!payload) return

      // Run pipeline
      const statsResult = await extractAutoStats(
        path.join(tmpDir, locale, 'clips.tsv'),
        3_600_000, // 1 hour total
      )()
      expect(statsResult._tag).toBe('Right')
      if (statsResult._tag !== 'Right') return

      const autoStats = statsResult.right
      const sample = sampleSentences(tmpDir, locale)
      const replacements = buildReplacementMap(
        payload,
        autoStats,
        locale,
        RELEASE_NAME,
        sample,
      )
      const rendered = fillTemplate(payload.template, replacements)

      // Write for manual inspection
      fs.writeFileSync(
        path.join(tmpDir, locale, 'README.md'),
        rendered,
        'utf-8',
      )

      // Structural integrity
      expect(rendered.length).toBeGreaterThan(200)
      expect(rendered).not.toMatch(/\{\{[A-Z_]+\}\}/) // no unfilled placeholders
      expect(rendered).not.toContain('<!--') // no remaining HTML comments

      // Locale identity
      expect(rendered).toContain(nativeName)
      expect(rendered).toContain(locale)
      expect(rendered).toContain(RELEASE_NAME)

      // Stats derived from fixture data
      expect(autoStats.clips).toBe(clipCount)
      expect(autoStats.speakers).toBeLessThanOrEqual(20) // max 20 unique users in fixture
      expect(autoStats.validatedClips).toBe(Math.floor(clipCount * 0.8))

      // Sentence sample: only is_used == "1" sentences are eligible
      expect(sample.length).toBeGreaterThan(0)
      expect(sample.length).toBeLessThanOrEqual(Math.min(5, usedCount))
    },
  )

  it('gender and age tables are populated for larger locales', async () => {
    const payload = payloads.get('en')!
    const statsResult = await extractAutoStats(
      path.join(tmpDir, 'en', 'clips.tsv'),
      3_600_000,
    )()
    if (statsResult._tag !== 'Right') return

    const { genderCounts, ageCounts } = statsResult.right
    // Fixture cycles through all GENDERS and AGES, so all should be present
    expect(Object.keys(genderCounts).length).toBe(GENDERS.length)
    expect(Object.keys(ageCounts).length).toBe(AGES.length)

    const replacements = buildReplacementMap(
      payload!,
      statsResult.right,
      'en',
      RELEASE_NAME,
      [],
    )
    expect(replacements['GENDER_TABLE']).toContain('Male, masculine')
    expect(replacements['GENDER_TABLE']).toContain('Female, feminine')
    expect(replacements['AGE_TABLE']).toContain('Twenties')
    expect(replacements['AGE_TABLE']).toContain('Thirties')
  })

  it('kbd handles a small language corpus without errors', async () => {
    const payload = payloads.get('kbd')!
    expect(payload.metadata['native_name']).toContain('Адыгэбзэ')

    const statsResult = await extractAutoStats(
      path.join(tmpDir, 'kbd', 'clips.tsv'),
      900_000, // 15 minutes
    )()
    expect(statsResult._tag).toBe('Right')
    if (statsResult._tag !== 'Right') return

    expect(statsResult.right.clips).toBe(15)
    expect(statsResult.right.totalHrs).toBeGreaterThan(0)

    const sample = sampleSentences(tmpDir, 'kbd')
    // All 10 sentences are is_used=1 -- expect up to 5 sampled
    expect(sample.length).toBe(5)
  })
})
