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

  // -- Accent/variant metadata (from DB, not file-based) --
  predefinedAccentNames?: string[]
  accentCodeMap?: Record<string, string> // accent_name → accent code
  variantCodeMap?: Record<string, string> // variant_name → variant code

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
  predefinedAccentNames?: string[],
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

        // When predefined accents list is provided (even if empty), only those
        // are counted individually. All others are grouped under "" (other).
        // An empty list means "no predefined accents" -> ALL accents go to "".
        const predefinedSet = predefinedAccentNames
          ? new Set(predefinedAccentNames)
          : null

        let clips = 0
        const clientIds = new Set<string>()
        const genderCounts: Record<string, number> = {}
        const ageCounts: Record<string, number> = {}
        const domainCounts: Record<string, number> = {}
        const variantCounts: Record<string, number> = {}
        const accentCounts: Record<string, number> = {}
        // Per-category unique speaker tracking (Sets → counts on close)
        const genderCids: Record<string, Set<string>> = {}
        const ageCids: Record<string, Set<string>> = {}
        const domainCids: Record<string, Set<string>> = {}
        const variantCids: Record<string, Set<string>> = {}
        const accentCids: Record<string, Set<string>> = {}

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
          const cid = clientIdIdx >= 0 ? cols[clientIdIdx] : ''
          if (cid) clientIds.add(cid)

          if (genderIdx >= 0) {
            const g = cols[genderIdx] || ''
            genderCounts[g] = (genderCounts[g] ?? 0) + 1
            if (cid) { ;(genderCids[g] ??= new Set()).add(cid) }
          }
          if (ageIdx >= 0) {
            const a = cols[ageIdx] || ''
            ageCounts[a] = (ageCounts[a] ?? 0) + 1
            if (cid) { ;(ageCids[a] ??= new Set()).add(cid) }
          }
          if (domainIdx >= 0) {
            const raw = cols[domainIdx] || ''
            // sentence_domain can be comma-separated (multiple domains per clip)
            const domains = raw.split(',')
            for (const d of domains) {
              const trimmed = d.trim()
              if (!trimmed) continue
              domainCounts[trimmed] = (domainCounts[trimmed] ?? 0) + 1
              if (cid) { ;(domainCids[trimmed] ??= new Set()).add(cid) }
            }
          }
          if (variantIdx >= 0) {
            const v = cols[variantIdx] || ''
            if (v) {
              variantCounts[v] = (variantCounts[v] ?? 0) + 1
              if (cid) { ;(variantCids[v] ??= new Set()).add(cid) }
            }
          }
          if (accentIdx >= 0) {
            const raw = cols[accentIdx] || ''
            // accents column is pipe-separated (multiple accents per user)
            const accents = raw.split('|')
            for (const accent of accents) {
              const trimmed = accent.trim()
              if (!trimmed) continue
              // If predefined list is available, group non-predefined under ""
              const key = predefinedSet && !predefinedSet.has(trimmed) ? '' : trimmed
              accentCounts[key] = (accentCounts[key] ?? 0) + 1
              if (cid) { ;(accentCids[key] ??= new Set()).add(cid) }
            }
          }
        })

        const setsToSizes = (
          map: Record<string, Set<string>>,
        ): Record<string, number> => {
          const out: Record<string, number> = {}
          for (const [k, s] of Object.entries(map)) out[k] = s.size
          return out
        }

        rl.on('close', () => {
          resolve({
            clips,
            speakers: clientIds.size,
            genderCounts,
            ageCounts,
            domainCounts,
            variantCounts,
            accentCounts,
            genderSpeakers: setsToSizes(genderCids),
            ageSpeakers: setsToSizes(ageCids),
            domainSpeakers: setsToSizes(domainCids),
            variantSpeakers: setsToSizes(variantCids),
            accentSpeakers: setsToSizes(accentCids),
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

      const reportedSentences = await countLinesInFile(
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

const scanBuckets = async (localeDir: string): Promise<Buckets> => {
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
    buckets[key] = await countLinesInFile(path.join(localeDir, file))
  }

  return buckets
}

// -- Sentence sampling -------------------------------------------------------

/**
 * Streams a TSV file and performs reservoir sampling on the sentence column.
 * If filterColumn/filterValue are given, only rows matching that filter are sampled.
 * Returns up to `sampleSize` randomly selected sentences without loading the
 * entire file into memory -- safe for multi-million-row files.
 */
const streamSampleSentences = async (
  filepath: string,
  sampleSize: number,
  filterColumn?: string,
  filterValue?: string,
): Promise<string[]> => {
  if (!fs.existsSync(filepath)) return []

  const inputStream = fs.createReadStream(filepath, { encoding: 'utf-8' })
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  })

  let sentenceIdx = -1
  let filterIdx = -1
  let isHeader = true
  let seen = 0
  const reservoir: string[] = []

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false
      const cols = line.split('\t')
      sentenceIdx = cols.indexOf('sentence')
      if (sentenceIdx < 0) {
        rl.close()
        inputStream.destroy()
        return []
      }
      filterIdx = filterColumn != null ? cols.indexOf(filterColumn) : -1
      continue
    }
    if (!line.trim()) continue

    const cols = line.split('\t')
    if (filterIdx >= 0 && cols[filterIdx] !== filterValue) continue

    const sentence = cols[sentenceIdx]
    if (!sentence || !sentence.trim()) continue

    // Reservoir sampling (Algorithm R)
    if (seen < sampleSize) {
      reservoir.push(sentence)
    } else {
      const j = Math.floor(Math.random() * (seen + 1))
      if (j < sampleSize) {
        reservoir[j] = sentence
      }
    }
    seen++
  }

  return reservoir
}

/**
 * Returns a random sample of N sentences from the locale directory.
 * Uses streaming reservoir sampling -- safe for arbitrarily large files.
 * Tries sources in order:
 *   1. validated_sentences.tsv (is_used == "1")
 *   2. clips.tsv (last resort)
 */
const sampleSentences = async (localeDir: string, count = 5): Promise<string[]> => {
  const vsPath = path.join(localeDir, 'validated_sentences.tsv')
  const sentences = await streamSampleSentences(vsPath, count, 'is_used', '1')
  if (sentences.length > 0) return sentences

  const clipsPath = path.join(localeDir, 'clips.tsv')
  return streamSampleSentences(clipsPath, count)
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
  predefinedAccentNames?: string[],
): TE.TaskEither<Error, LocaleReleaseData> =>
  pipe(
    TE.Do,
    TE.bind('clipsScan', () =>
      scanClipsTsv(path.join(localeDir, 'clips.tsv'), predefinedAccentNames),
    ),
    TE.bind('sentenceScan', () => scanSentenceFiles(localeDir)),
    TE.chain(({ clipsScan, sentenceScan }) => TE.tryCatch(async () => {
      const buckets = await scanBuckets(localeDir)
      const sentencesSample = await sampleSentences(localeDir)

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
        genderSpeakers: clipsScan.genderSpeakers,
        ageSpeakers: clipsScan.ageSpeakers,
        domainSpeakers: clipsScan.domainSpeakers,
        variantSpeakers: clipsScan.variantSpeakers,
        accentSpeakers: clipsScan.accentSpeakers,

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
    }, reason => Error(String(reason)))),
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
    RTE.chainTaskEitherK(({ locale, releaseDirPath, predefinedAccentNames }) => {
      const localeDir = path.join(releaseDirPath, locale)
      logger.info(
        'LOCALE_DATA',
        `[${locale}] Scanning locale data (clips + sentences + buckets)`,
      )
      return scanLocaleData(localeDir, totalDurationMs, predefinedAccentNames)
    }),
  )
