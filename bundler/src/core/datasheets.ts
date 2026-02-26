import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv, DatasheetLocalePayload } from '../types'
import { uploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName } from '../config/config'
import { sanitizeLicenseName } from './compress'
import { countLinesInFile, unitToHours } from './utils'
import { logger } from '../infrastructure/logger'

// -- Auto-stats extraction ---------------------------------------------------

type DatasheetAutoStats = {
  clips: number
  speakers: number
  totalHrs: number
  validHrs: number
  genderCounts: Record<string, number>
  ageCounts: Record<string, number>
  validatedClips: number
}

/**
 * Quick scan of clips.tsv to collect just the counts needed
 * for the datasheet template. Does NOT load the entire file into
 * memory -- streams line-by-line.
 */
export const extractAutoStats = (
  clipsFilePath: string,
  totalDurationInMs: number,
): TE.TaskEither<Error, DatasheetAutoStats> =>
  TE.tryCatch(
    () =>
      new Promise<DatasheetAutoStats>((resolve, reject) => {
        if (!fs.existsSync(clipsFilePath)) {
          return reject(new Error(`clips.tsv not found: ${clipsFilePath}`))
        }

        const rl = readline.createInterface({
          input: fs.createReadStream(clipsFilePath, 'utf-8'),
          crlfDelay: Infinity,
        })

        let headerParsed = false
        let genderIdx = -1
        let ageIdx = -1
        let clientIdIdx = -1

        let clips = 0
        const clientIds = new Set<string>()
        const genderCounts: Record<string, number> = {}
        const ageCounts: Record<string, number> = {}

        rl.on('line', line => {
          const cols = line.split('\t')

          if (!headerParsed) {
            headerParsed = true
            genderIdx = cols.indexOf('gender')
            ageIdx = cols.indexOf('age')
            clientIdIdx = cols.indexOf('client_id')
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
        })

        rl.on('close', () => {
          const avgDurationMs = clips > 0 ? totalDurationInMs / clips : 0
          // Count validated clips from CorporaCreator output (same directory as clips.tsv)
          const validatedClips = countLinesInFile(
            path.join(path.dirname(clipsFilePath), 'validated.tsv'),
          )
          resolve({
            clips,
            speakers: clientIds.size,
            totalHrs: unitToHours(totalDurationInMs, 'ms', 2),
            validHrs: unitToHours(
              Math.round(avgDurationMs * validatedClips) / 1000,
              's',
              2,
            ),
            genderCounts,
            ageCounts,
            validatedClips,
          })
        })

        rl.on('error', reject)
      }),
    reason => Error(String(reason)),
  )

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
    // Try 'sentence' first, fall back to 'text' (clips.tsv uses 'sentence' too after CC)
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
 * Returns a random sample of N sentences from the locale's release directory.
 *
 * Tries sources in order:
 *   1. validated_sentences.tsv (is_used == "1" — excludes bad/unwanted sentences)
 *   2. clips.tsv (last resort)
 */
export const sampleSentences = (
  releaseDirPath: string,
  locale: string,
  count = 5,
): string[] => {
  const localeDir = path.join(releaseDirPath, locale)

  // 1. validated_sentences.tsv with is_used filter
  const vsPath = path.join(localeDir, 'validated_sentences.tsv')
  const sentences = extractSentences(vsPath, 'is_used', '1')
  if (sentences.length > 0) return reservoirSample(sentences, count)

  // 2. clips.tsv (last resort)
  const clipsPath = path.join(localeDir, 'clips.tsv')
  const allClips = extractSentences(clipsPath)
  return reservoirSample(allClips, count)
}

// -- Template filling --------------------------------------------------------

const formatMarkdownTable = (
  header: [string, string],
  rows: [string, string][],
): string => {
  const lines = [
    `| ${header[0]} | ${header[1]} |`,
    '|---|---|',
    ...rows.map(([k, v]) => `| ${k} | ${v} |`),
  ]
  return lines.join('\n')
}

const GENDER_LABELS: Record<string, string> = {
  male_masculine: 'Male, masculine',
  female_feminine: 'Female, feminine',
  transgender: 'Transgender',
  'non-binary': 'Non-binary',
  do_not_wish_to_say: 'Prefer not to say',
  '': 'Undeclared',
}

const AGE_LABELS: Record<string, string> = {
  teens: 'Teens',
  twenties: 'Twenties',
  thirties: 'Thirties',
  fourties: 'Fourties',
  fifties: 'Fifties',
  sixties: 'Sixties',
  seventies: 'Seventies',
  eighties: 'Eighties',
  nineties: 'Nineties',
  '': 'Undeclared',
}

const buildGenderTable = (
  genderCounts: Record<string, number>,
  totalClips: number,
): string => {
  const rows: [string, string][] = Object.entries(genderCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => {
      const label = GENDER_LABELS[key] ?? key
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      return [label, `${count} (${pct}%)`]
    })
  return formatMarkdownTable(['Gender', 'Frequency'], rows)
}

const buildAgeTable = (
  ageCounts: Record<string, number>,
  totalClips: number,
): string => {
  const rows: [string, string][] = Object.entries(ageCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => {
      const label = AGE_LABELS[key] ?? key
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      return [label, `${count} (${pct}%)`]
    })
  return formatMarkdownTable(['Age band', 'Frequency'], rows)
}

// -- Data splits table --------------------------------------------------------

const SPLIT_FILES = ['train', 'dev', 'test', 'validated', 'invalidated', 'other'] as const

/**
 * Reads CorporaCreator output files and builds a markdown table with
 * split name, clip count, and percentage of total.
 */
export const buildDataSplitsTable = (
  releaseDirPath: string,
  locale: string,
  totalClips: number,
): string => {
  const localeDir = path.join(releaseDirPath, locale)
  const rows: [string, string][] = []

  for (const split of SPLIT_FILES) {
    const count = countLinesInFile(path.join(localeDir, `${split}.tsv`))
    if (count === 0) continue
    const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
    rows.push([
      split.charAt(0).toUpperCase() + split.slice(1),
      `${count.toLocaleString()} (${pct}%)`,
    ])
  }

  if (rows.length === 0) return ''
  return formatMarkdownTable(['Split', 'Clips'], rows)
}

/**
 * Builds the full replacement map from all sources:
 * 1. Metadata (native_name, english_name, etc.)
 * 2. Auto-generated stats (clips, hours, speakers, demographics)
 * 3. Community fields (language_description, etc.) -- precedence over auto
 */
export const buildReplacementMap = (
  payload: DatasheetLocalePayload,
  autoStats: DatasheetAutoStats,
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  sentencesSample: string[],
): Record<string, string> => {
  const map: Record<string, string> = {}

  // Metadata
  map['NATIVE_NAME'] = payload.metadata.native_name ?? locale
  map['ENGLISH_NAME'] = payload.metadata.english_name ?? locale
  map['LOCALE'] = locale
  map['VERSION'] = releaseName

  // Auto-generated stats
  map['CLIPS'] = String(autoStats.clips)
  map['HOURS_RECORDED'] = String(autoStats.totalHrs)
  map['HOURS_VALIDATED'] = String(autoStats.validHrs)
  map['SPEAKERS'] = String(autoStats.speakers)

  // Demographics
  map['GENDER_TABLE'] = buildGenderTable(
    autoStats.genderCounts,
    autoStats.clips,
  )
  map['AGE_TABLE'] = buildAgeTable(autoStats.ageCounts, autoStats.clips)

  // Data splits
  const splitsTable = buildDataSplitsTable(releaseDirPath, locale, autoStats.clips)
  if (splitsTable) {
    map['DATA_SPLITS_TABLE'] = splitsTable
  }

  // Sentences sample
  if (sentencesSample.length > 0) {
    map['SENTENCES_SAMPLE'] = sentencesSample
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')
  }

  // Community fields -- these have precedence: only set if non-empty
  for (const [key, value] of Object.entries(payload.community_fields)) {
    if (value && value.trim().length > 0) {
      map[key.toUpperCase()] = value
    }
  }

  return map
}

/**
 * Fills a template string by replacing `{{KEY}}` and `<!-- {{KEY}} -->`
 * patterns with values from the replacement map.
 * Then strips all remaining HTML comment blocks.
 *
 * Also injects DATA_SPLITS_TABLE after the "## Data splits" header
 * if the template lacks the explicit placeholder (backward compat with
 * older cv-datasheets templates).
 */
export const fillTemplate = (
  template: string,
  replacements: Record<string, string>,
): string => {
  let result = template

  // Inject DATA_SPLITS_TABLE after "## Data splits" header if no placeholder exists
  if (
    replacements['DATA_SPLITS_TABLE'] &&
    !result.includes('{{DATA_SPLITS_TABLE}}')
  ) {
    result = result.replace(
      /(## Data splits[^\n]*\n)/,
      `$1\n${replacements['DATA_SPLITS_TABLE']}\n`,
    )
  }

  // First pass: replace <!-- {{KEY}} --> with value (or empty string if no value)
  result = result.replace(
    /<!--\s*\{\{(\w+)\}\}\s*-->/g,
    (_match, key: string) => {
      return replacements[key] ?? ''
    },
  )

  // Second pass: replace remaining inline {{KEY}} (e.g. in title/header lines)
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return replacements[key] ?? ''
  })

  // Strip remaining HTML comment blocks (instructions, examples, optional markers)
  result = result.replace(/<!--[\s\S]*?-->/g, '')

  // Clean up excessive blank lines (3+ -> 2)
  result = result.replace(/\n{3,}/g, '\n\n')

  return result.trim() + '\n'
}

// -- Pipeline ----------------------------------------------------------------

const uploadToDatasetBucket = uploadToBucket(getDatasetBundlerBucketName())

/**
 * Derives a version tag from the release name for use in GCS filenames.
 * 'cv-corpus-25.0-2026-03-06'       => '25.0-2026-03-06'
 * 'cv-corpus-25.0-delta-2026-03-06' => '25.0-delta-2026-03-06'
 * 'cv-corpus-25.0-2026-03-06-licensed' => '25.0-2026-03-06-licensed'
 */
const releaseVersionTag = (releaseName: string): string =>
  releaseName.replace(/^cv-corpus-/, '')

const datasheetPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  totalDurationInMs: number,
  payload: DatasheetLocalePayload,
  license?: string,
): TE.TaskEither<Error, string> => {
  logger.info('DATASHEETS', `[${locale}] Generating datasheet`)
  const clipsFilePath = path.join(releaseDirPath, locale, 'clips.tsv')

  return pipe(
    TE.Do,
    // 1. Extract auto-stats from clips.tsv
    TE.bind('autoStats', () => extractAutoStats(clipsFilePath, totalDurationInMs)),
    // 2. Sample sentences for the template
    TE.let('sentencesSample', () =>
      sampleSentences(releaseDirPath, locale),
    ),
    // 3. Build replacement map and fill template
    TE.let('replacements', ({ autoStats, sentencesSample }) =>
      buildReplacementMap(payload, autoStats, locale, releaseName, releaseDirPath, sentencesSample),
    ),
    TE.let('rendered', ({ replacements }) =>
      fillTemplate(payload.template, replacements),
    ),
    // 4. Write README.md into locale directory (will be included in tar)
    TE.chainFirst(({ rendered }) =>
      TE.tryCatch(
        async () => {
          const readmePath = path.join(releaseDirPath, locale, 'README.md')
          fs.writeFileSync(readmePath, rendered, 'utf-8')
          logger.info(
            'DATASHEETS',
            `[${locale}] Wrote README.md (${rendered.length} bytes)`,
          )
        },
        reason => Error(String(reason)),
      ),
    ),
    // 5. Upload to GCS under <release>/datasheets/ with a versioned filename
    TE.chainFirst(({ rendered }) => {
      const versionTag = releaseVersionTag(releaseName)
      const filename = license
        ? `cv-datasheet-${versionTag}-${locale}-${sanitizeLicenseName(license)}.md`
        : `cv-datasheet-${versionTag}-${locale}.md`
      const uploadPath = `${releaseName}/datasheets/${filename}`
      return uploadToDatasetBucket(uploadPath)(Buffer.from(rendered, 'utf-8'))
    }),
    TE.map(({ rendered }) => rendered),
  )
}

/**
 * Generates and uploads a datasheet for the current locale.
 * Silently skips if no datasheet payload is available (non-blocking).
 */
export const runGenerateDatasheet = (
  totalDurationInMs: number,
): RTE.ReaderTaskEither<AppEnv, Error, void> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({ locale, releaseName, releaseDirPath, datasheetPayload, license, type }) => {
        if (type !== 'full') {
          logger.debug(
            'DATASHEETS',
            `[${locale}] Skipping datasheets for ${type} release`,
          )
          return TE.right(undefined)
        }
        if (!datasheetPayload) {
          logger.debug(
            'DATASHEETS',
            `[${locale}] No datasheet payload, skipping`,
          )
          return TE.right(undefined)
        }
        return pipe(
          datasheetPipeline(
            locale,
            releaseName,
            releaseDirPath,
            totalDurationInMs,
            datasheetPayload,
            license,
          ),
          TE.map(() => undefined),
        )
      },
    ),
  )
