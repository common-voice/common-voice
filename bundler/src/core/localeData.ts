import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { parse } from 'csv-parse'

import { AppEnv, ValidatedSentence, UnvalidatedSentence } from '../types'
import { CORPORA_CREATOR_FILES } from '../infrastructure/corporaCreator'
import { countLinesInFile, unitToHours } from './utils'
import { logger } from '../infrastructure/logger'

// -- Types -------------------------------------------------------------------

export type Buckets = {
  dev: number
  invalidated: number
  other: number
  test: number
  train: number
  validated: number
}

export type LocaleReleaseData = {
  // -- From clips.tsv (single streaming pass) --
  clips: number
  speakers: number
  genderCounts: Record<string, number>
  ageCounts: Record<string, number>
  domainCounts: Record<string, number>
  variantCounts: Record<string, number>
  accentCounts: Record<string, number>
  // Per-category unique speaker counts (parallel to *Counts above)
  genderSpeakers: Record<string, number>
  ageSpeakers: Record<string, number>
  domainSpeakers: Record<string, number>
  variantSpeakers: Record<string, number>
  accentSpeakers: Record<string, number>

  // -- From CC output files (line counts, run once) --
  buckets: Buckets

  // -- From sentence files (streamed) --
  reportedSentences: number
  validatedSentences: number
  unvalidatedSentences: number
  rejectedSentences: number
  pendingSentences: number
  sourceCounts: Record<string, number>
  sentenceVariantCounts: Record<string, number>

  // -- Duration-derived --
  totalDurationMs: number
  totalHrs: number
  validHrs: number
  avgDurationSecs: number
  validDurationSecs: number

  // -- Sentence samples --
  sentencesSample: string[]
}

// -- Source filtering --------------------------------------------------------

const SOURCE_COUNT_THRESHOLD = 5

/**
 * Filters source counts: only sources with count >= threshold are kept
 * individually. Low-count sources (often individual contributor names)
 * are grouped under "Other" to avoid PII exposure.
 */
export const filterSourceCounts = (
  raw: Record<string, number>,
): Record<string, number> => {
  const filtered: Record<string, number> = {}
  let otherTotal = 0

  for (const [source, count] of Object.entries(raw)) {
    if (!source || source.trim().length === 0) continue
    if (count >= SOURCE_COUNT_THRESHOLD) {
      filtered[source] = count
    } else {
      otherTotal += count
    }
  }

  if (otherTotal > 0) {
    filtered['Other'] = otherTotal
  }

  return filtered
}

// -- Clips.tsv scanner ------------------------------------------------------

type ClipsScanResult = {
  clips: number
  speakers: number
  genderCounts: Record<string, number>
  ageCounts: Record<string, number>
  domainCounts: Record<string, number>
  variantCounts: Record<string, number>
  accentCounts: Record<string, number>
  genderSpeakers: Record<string, number>
  ageSpeakers: Record<string, number>
  domainSpeakers: Record<string, number>
  variantSpeakers: Record<string, number>
  accentSpeakers: Record<string, number>
}

/**
 * Single streaming pass of clips.tsv. Collects all column-based counts
 * needed by both datasheets and stats.
 */
export const scanClipsTsv = (
  clipsFilePath: string,
): TE.TaskEither<Error, ClipsScanResult> =>
  TE.tryCatch(
    () =>
      new Promise<ClipsScanResult>((resolve, reject) => {
        if (!fs.existsSync(clipsFilePath)) {
          return reject(new Error(`clips.tsv not found: ${clipsFilePath}`))
        }

        const rl = readline.createInterface({
          input: fs.createReadStream(clipsFilePath, 'utf-8'),
          crlfDelay: Infinity,
        })

        let headerParsed = false
        let clientIdIdx = -1
        let genderIdx = -1
        let ageIdx = -1
        let domainIdx = -1
        let variantIdx = -1
        let accentIdx = -1

        let clips = 0
        const clientIds = new Set<string>()
        const genderCounts: Record<string, number> = {}
        const ageCounts: Record<string, number> = {}
        const domainCounts: Record<string, number> = {}
        const variantCounts: Record<string, number> = {}
        const accentCounts: Record<string, number> = {}

        rl.on('line', line => {
          const cols = line.split('\t')

          if (!headerParsed) {
            headerParsed = true
            clientIdIdx = cols.indexOf('client_id')
            genderIdx = cols.indexOf('gender')
            ageIdx = cols.indexOf('age')
            domainIdx = cols.indexOf('sentence_domain')
            variantIdx = cols.indexOf('variant')
            accentIdx = cols.indexOf('accents')
            return
          }

          clips++
          if (clientIdIdx >= 0) clientIds.add(cols[clientIdIdx])

          if (genderIdx >= 0) {
            const g = cols[genderIdx] || ''
            genderCounts[g] = (genderCounts[g] ?? 0) + 1
          }
          if (ageIdx >= 0) {
            const a = cols[ageIdx] || ''
            ageCounts[a] = (ageCounts[a] ?? 0) + 1
          }
          if (domainIdx >= 0) {
            const raw = cols[domainIdx] || ''
            // sentence_domain can be comma-separated (multiple domains per clip)
            const domains = raw.split(',')
            for (const d of domains) {
              const trimmed = d.trim()
              domainCounts[trimmed] = (domainCounts[trimmed] ?? 0) + 1
            }
          }
          if (variantIdx >= 0) {
            const v = cols[variantIdx] || ''
            if (v) variantCounts[v] = (variantCounts[v] ?? 0) + 1
          }
          if (accentIdx >= 0) {
            const a = cols[accentIdx] || ''
            if (a) accentCounts[a] = (accentCounts[a] ?? 0) + 1
          }
        })

        rl.on('close', () => {
          resolve({
            clips,
            speakers: clientIds.size,
            genderCounts,
            ageCounts,
            domainCounts,
            variantCounts,
            accentCounts,
          })
        })

        rl.on('error', reject)
      }),
    reason => Error(String(reason)),
  )

// -- Sentence file scanner ---------------------------------------------------

type SentenceScanResult = {
  reportedSentences: number
  validatedSentences: number
  unvalidatedSentences: number
  rejectedSentences: number
  pendingSentences: number
  sourceCounts: Record<string, number>
  sentenceVariantCounts: Record<string, number>
}

/**
 * Streams validated_sentences.tsv for source + variant extraction.
 * Returns row count and per-column aggregates.
 */
const scanValidatedSentences = (
  filepath: string,
): Promise<{
  count: number
  sourceCounts: Record<string, number>
  variantCounts: Record<string, number>
}> =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return resolve({ count: 0, sourceCounts: {}, variantCounts: {} })
    }

    const fileStream = fs.createReadStream(filepath)
    const parser = parse({ delimiter: '\t', columns: true, quote: false })

    let count = 0
    const sourceCounts: Record<string, number> = {}
    const variantCounts: Record<string, number> = {}

    fileStream
      .pipe(parser)
      .on('data', (row: ValidatedSentence) => {
        count++
        const source = (row.source || '').trim()
        if (source) {
          sourceCounts[source] = (sourceCounts[source] ?? 0) + 1
        }
        const variant = (row.variant || '').trim()
        if (variant) {
          variantCounts[variant] = (variantCounts[variant] ?? 0) + 1
        }
      })
      .on('end', () => resolve({ count, sourceCounts, variantCounts }))
      .on('error', reject)
  })

/**
 * Streams unvalidated_sentences.tsv for variant + status extraction.
 * Returns row count, variant counts, and rejected/pending breakdown.
 */
const scanUnvalidatedSentences = (
  filepath: string,
): Promise<{
  count: number
  rejected: number
  pending: number
  variantCounts: Record<string, number>
}> =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return resolve({ count: 0, rejected: 0, pending: 0, variantCounts: {} })
    }

    const fileStream = fs.createReadStream(filepath)
    const parser = parse({ delimiter: '\t', columns: true, quote: false })

    let count = 0
    let rejected = 0
    let pending = 0
    const variantCounts: Record<string, number> = {}

    fileStream
      .pipe(parser)
      .on('data', (row: UnvalidatedSentence) => {
        count++
        const status = (row.status || '').trim()
        if (status === 'rejected') {
          rejected++
        } else {
          pending++
        }
        const variant = (row.variant || '').trim()
        if (variant) {
          variantCounts[variant] = (variantCounts[variant] ?? 0) + 1
        }
      })
      .on('end', () => resolve({ count, rejected, pending, variantCounts }))
      .on('error', reject)
  })

/**
 * Scans all sentence files for a locale:
 * - validated_sentences.tsv: streamed for source, variant
 * - unvalidated_sentences.tsv: streamed for variant, status
 * - reported.tsv: line count only
 */
export const scanSentenceFiles = (
  localeDir: string,
): TE.TaskEither<Error, SentenceScanResult> =>
  TE.tryCatch(
    async () => {
      const [validated, unvalidated] = await Promise.all([
        scanValidatedSentences(
          path.join(localeDir, 'validated_sentences.tsv'),
        ),
        scanUnvalidatedSentences(
          path.join(localeDir, 'unvalidated_sentences.tsv'),
        ),
      ])

      const reportedSentences = countLinesInFile(
        path.join(localeDir, 'reported.tsv'),
      )

      // Merge variant counts from both sentence TSVs
      const sentenceVariantCounts: Record<string, number> = {
        ...validated.variantCounts,
      }
      for (const [variant, count] of Object.entries(
        unvalidated.variantCounts,
      )) {
        sentenceVariantCounts[variant] =
          (sentenceVariantCounts[variant] ?? 0) + count
      }

      return {
        reportedSentences,
        validatedSentences: validated.count,
        unvalidatedSentences: unvalidated.count,
        rejectedSentences: unvalidated.rejected,
        pendingSentences: unvalidated.pending,
        sourceCounts: filterSourceCounts(validated.sourceCounts),
        sentenceVariantCounts,
      }
    },
    reason => Error(String(reason)),
  )

// -- CC output line counts ---------------------------------------------------

const scanBuckets = (localeDir: string): Buckets => {
  const buckets: Buckets = {
    dev: 0,
    invalidated: 0,
    other: 0,
    test: 0,
    train: 0,
    validated: 0,
  }

  for (const file of CORPORA_CREATOR_FILES) {
    const key = file.replace('.tsv', '') as keyof Buckets
    buckets[key] = countLinesInFile(path.join(localeDir, file))
  }

  return buckets
}

// -- Sentence sampling -------------------------------------------------------

/**
 * Reservoir-samples N items from the given array.
 */
const reservoirSample = (items: string[], count: number): string[] => {
  const sample: string[] = []
  for (let i = 0; i < items.length; i++) {
    if (i < count) {
      sample.push(items[i])
    } else {
      const j = Math.floor(Math.random() * (i + 1))
      if (j < count) {
        sample[j] = items[i]
      }
    }
  }
  return sample
}

/**
 * Extracts the sentence column from a TSV file.
 * If filterColumn/filterValue are given, only rows matching that filter are included.
 */
const extractSentences = (
  filepath: string,
  filterColumn?: string,
  filterValue?: string,
): string[] => {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    if (lines.length <= 1) return []

    const header = lines[0].split('\t')
    const sentenceIdx = header.indexOf('sentence')
    if (sentenceIdx < 0) return []

    const filterIdx =
      filterColumn != null ? header.indexOf(filterColumn) : -1

    return lines
      .slice(1)
      .filter(line => {
        if (filterIdx < 0) return true
        return line.split('\t')[filterIdx] === filterValue
      })
      .map(line => line.split('\t')[sentenceIdx])
      .filter(s => s && s.trim().length > 0)
  } catch {
    return []
  }
}

/**
 * Returns a random sample of N sentences from the locale directory.
 * Tries sources in order:
 *   1. validated_sentences.tsv (is_used == "1")
 *   2. clips.tsv (last resort)
 */
const sampleSentences = (localeDir: string, count = 5): string[] => {
  const vsPath = path.join(localeDir, 'validated_sentences.tsv')
  const sentences = extractSentences(vsPath, 'is_used', '1')
  if (sentences.length > 0) return reservoirSample(sentences, count)

  const clipsPath = path.join(localeDir, 'clips.tsv')
  const allClips = extractSentences(clipsPath)
  return reservoirSample(allClips, count)
}

// -- Orchestrator ------------------------------------------------------------

/**
 * Scans all locale files and computes a complete LocaleReleaseData.
 * This is the single shared extraction step consumed by both
 * datasheets (template fill) and stats (JSON finalize).
 */
export const scanLocaleData = (
  localeDir: string,
  totalDurationMs: number,
): TE.TaskEither<Error, LocaleReleaseData> =>
  pipe(
    TE.Do,
    TE.bind('clipsScan', () =>
      scanClipsTsv(path.join(localeDir, 'clips.tsv')),
    ),
    TE.bind('sentenceScan', () => scanSentenceFiles(localeDir)),
    TE.map(({ clipsScan, sentenceScan }) => {
      const buckets = scanBuckets(localeDir)
      const sentencesSample = sampleSentences(localeDir)

      const avgDurationMs =
        clipsScan.clips > 0 ? totalDurationMs / clipsScan.clips : 0
      const validDurationSecs =
        Math.round(avgDurationMs * buckets.validated) / 1000

      return {
        // Clips scan
        clips: clipsScan.clips,
        speakers: clipsScan.speakers,
        genderCounts: clipsScan.genderCounts,
        ageCounts: clipsScan.ageCounts,
        domainCounts: clipsScan.domainCounts,
        variantCounts: clipsScan.variantCounts,
        accentCounts: clipsScan.accentCounts,

        // CC buckets
        buckets,

        // Sentence scan
        reportedSentences: sentenceScan.reportedSentences,
        validatedSentences: sentenceScan.validatedSentences,
        unvalidatedSentences: sentenceScan.unvalidatedSentences,
        rejectedSentences: sentenceScan.rejectedSentences,
        pendingSentences: sentenceScan.pendingSentences,
        sourceCounts: sentenceScan.sourceCounts,
        sentenceVariantCounts: sentenceScan.sentenceVariantCounts,

        // Duration
        totalDurationMs,
        totalHrs: unitToHours(totalDurationMs, 'ms', 2),
        validHrs: unitToHours(validDurationSecs, 's', 2),
        avgDurationSecs:
          clipsScan.clips > 0
            ? Math.round(totalDurationMs / clipsScan.clips) / 1000
            : 0,
        validDurationSecs,

        // Samples
        sentencesSample,
      }
    }),
  )

// -- RTE pipeline step -------------------------------------------------------

/**
 * Pipeline step: scans all locale files and stores LocaleReleaseData
 * in AppEnv for downstream consumers (datasheets, stats).
 */
export const runScanLocaleData = (
  totalDurationMs: number,
): RTE.ReaderTaskEither<AppEnv, Error, LocaleReleaseData> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) => {
      const localeDir = path.join(releaseDirPath, locale)
      logger.info(
        'LOCALE_DATA',
        `[${locale}] Scanning locale data (clips + sentences + buckets)`,
      )
      return scanLocaleData(localeDir, totalDurationMs)
    }),
  )
