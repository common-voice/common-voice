import * as fs from 'node:fs'
import * as path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv, DatasheetLocalePayload } from '../types'
import { uploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName } from '../config/config'
import { sanitizeLicenseName } from './compress'
import { logger } from '../infrastructure/logger'
import type { Buckets, LocaleReleaseData } from './localeData'

// -- Markdown table helpers --------------------------------------------------

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

// -- Table builders ----------------------------------------------------------

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
      return [label, `${count.toLocaleString('en')} (${pct}%)`]
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
      return [label, `${count.toLocaleString('en')} (${pct}%)`]
    })
  return formatMarkdownTable(['Age band', 'Frequency'], rows)
}

const SPLIT_NAMES = ['train', 'dev', 'test', 'validated', 'invalidated', 'other'] as const

export const buildDataSplitsTable = (
  buckets: Buckets,
  totalClips: number,
): string => {
  const rows: [string, string][] = []

  for (const split of SPLIT_NAMES) {
    const count = buckets[split]
    if (count === 0) continue
    const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
    rows.push([
      split.charAt(0).toUpperCase() + split.slice(1),
      `${count.toLocaleString('en')} (${pct}%)`,
    ])
  }

  if (rows.length === 0) return ''
  return formatMarkdownTable(['Split', 'Clips'], rows)
}

export const buildVariantStatsTable = (
  variantCounts: Record<string, number>,
  totalClips: number,
): string => {
  const entries = Object.entries(variantCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const rows: [string, string][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([variant, count]) => {
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      return [variant, `${count.toLocaleString('en')} (${pct}%)`]
    })
  return formatMarkdownTable(['Variant', 'Clips'], rows)
}

export const buildAccentStatsTable = (
  accentCounts: Record<string, number>,
  totalClips: number,
): string => {
  const entries = Object.entries(accentCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const rows: [string, string][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([accent, count]) => {
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      return [accent, `${count.toLocaleString('en')} (${pct}%)`]
    })
  return formatMarkdownTable(['Accent', 'Clips'], rows)
}

export const buildTextCorpusStatsTable = (
  data: Pick<LocaleReleaseData,
    'validatedSentences' | 'unvalidatedSentences' |
    'pendingSentences' | 'rejectedSentences' | 'reportedSentences'
  >,
): string => {
  const all: [string, number][] = [
    ['Validated sentences', data.validatedSentences],
    ['Unvalidated sentences', data.unvalidatedSentences],
    ['Pending sentences', data.pendingSentences],
    ['Rejected sentences', data.rejectedSentences],
    ['Reported sentences', data.reportedSentences],
  ]
  const rows: [string, string][] = all
    .filter(([, v]) => v > 0)
    .map(([label, v]) => [label, v.toLocaleString('en')])
  if (rows.length === 0) return ''
  return formatMarkdownTable(['Category', 'Count'], rows)
}

export const buildSourcesStatsTable = (
  sourceCounts: Record<string, number>,
): string => {
  const entries = Object.entries(sourceCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const total = entries.reduce((sum, [, c]) => sum + c, 0)
  const rows: [string, string][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([source, count]) => {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
      return [source, `${count.toLocaleString('en')} (${pct}%)`]
    })
  return formatMarkdownTable(['Source', 'Sentences'], rows)
}

export const buildTextDomainStatsTable = (
  domainCounts: Record<string, number>,
  totalClips: number,
): string => {
  const entries = Object.entries(domainCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const rows: [string, string][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([domain, count]) => {
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      return [domain, `${count.toLocaleString('en')} (${pct}%)`]
    })
  return formatMarkdownTable(['Domain', 'Clips'], rows)
}

// -- Replacement map ---------------------------------------------------------

/**
 * Builds the full replacement map from all sources:
 * 1. Metadata (native_name, english_name, etc.)
 * 2. Auto-generated stats from LocaleReleaseData
 * 3. Community fields (language_description, etc.) -- precedence over auto
 */
export const buildReplacementMap = (
  payload: DatasheetLocalePayload,
  data: LocaleReleaseData,
  locale: string,
  releaseName: string,
): Record<string, string> => {
  const map: Record<string, string> = {}

  // Metadata
  map['NATIVE_NAME'] = payload.metadata.native_name ?? locale
  map['ENGLISH_NAME'] = payload.metadata.english_name ?? locale
  map['LOCALE'] = locale
  map['VERSION'] = releaseName

  // Auto-generated stats
  map['CLIPS'] = String(data.clips)
  map['HOURS_RECORDED'] = String(data.totalHrs)
  map['HOURS_VALIDATED'] = String(data.validHrs)
  map['SPEAKERS'] = String(data.speakers)

  // Demographics
  map['GENDER_TABLE'] = buildGenderTable(data.genderCounts, data.clips)
  map['AGE_TABLE'] = buildAgeTable(data.ageCounts, data.clips)

  // Data splits
  const splitsTable = buildDataSplitsTable(data.buckets, data.clips)
  if (splitsTable) {
    map['DATA_SPLITS_TABLE'] = splitsTable
  }

  // New stats tables
  const variantTable = buildVariantStatsTable(data.variantCounts, data.clips)
  if (variantTable) map['VARIANT_STATS_TABLE'] = variantTable

  const accentTable = buildAccentStatsTable(data.accentCounts, data.clips)
  if (accentTable) map['ACCENT_STATS_TABLE'] = accentTable

  const textCorpusTable = buildTextCorpusStatsTable(data)
  if (textCorpusTable) map['TEXT_CORPUS_STATS_TABLE'] = textCorpusTable

  const sourcesTable = buildSourcesStatsTable(data.sourceCounts)
  if (sourcesTable) map['SOURCES_STATS_TABLE'] = sourcesTable

  const domainTable = buildTextDomainStatsTable(data.domainCounts, data.clips)
  if (domainTable) map['TEXT_DOMAIN_STATS_TABLE'] = domainTable

  // Sentences sample
  if (data.sentencesSample.length > 0) {
    map['SENTENCES_SAMPLE'] = data.sentencesSample
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

// -- Template filling --------------------------------------------------------

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
  data: LocaleReleaseData,
  payload: DatasheetLocalePayload,
  license?: string,
): TE.TaskEither<Error, string> => {
  logger.info('DATASHEETS', `[${locale}] Generating datasheet`)

  const replacements = buildReplacementMap(payload, data, locale, releaseName)
  const rendered = fillTemplate(payload.template, replacements)

  return pipe(
    // Write README.md into locale directory (will be included in tar)
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
    // Upload to GCS under <release>/datasheets/ with a versioned filename
    TE.chainFirst(() => {
      const versionTag = releaseVersionTag(releaseName)
      const filename = license
        ? `cv-datasheet-${versionTag}-${locale}-${sanitizeLicenseName(license)}.md`
        : `cv-datasheet-${versionTag}-${locale}.md`
      const uploadPath = `${releaseName}/datasheets/${filename}`
      return uploadToDatasetBucket(uploadPath)(Buffer.from(rendered, 'utf-8'))
    }),
    TE.map(() => rendered),
  )
}

/**
 * Generates and uploads a datasheet for the current locale.
 * Reads from AppEnv.localeData (populated by the scanLocaleData step).
 * Silently skips if no datasheet payload or locale data is available.
 */
export const runGenerateDatasheet: RTE.ReaderTaskEither<AppEnv, Error, void> =
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({ locale, releaseName, releaseDirPath, datasheetPayload, localeData, license, type }) => {
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
        if (!localeData) {
          logger.warn(
            'DATASHEETS',
            `[${locale}] No locale data available, skipping datasheet`,
          )
          return TE.right(undefined)
        }
        return pipe(
          datasheetPipeline(
            locale,
            releaseName,
            releaseDirPath,
            localeData,
            datasheetPayload,
            license,
          ),
          TE.map(() => undefined),
        )
      },
    ),
  )
