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
  header: string[],
  rows: string[][],
): string => {
  const lines = [
    `| ${header.join(' | ')} |`,
    `|${header.map(() => '---').join('|')}|`,
    ...rows.map(r => `| ${r.join(' | ')} |`),
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
  locale: string = 'en',
  speakerCounts?: Record<string, number>,
  totalSpeakers?: number,
): string => {
  const hasSpk = speakerCounts && totalSpeakers != null && totalSpeakers > 0
  const rows: string[][] = Object.entries(genderCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => {
      const label = GENDER_LABELS[key] ?? key
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      const row = [label, `${count.toLocaleString(locale)} (${pct}%)`]
      if (hasSpk) {
        const spk = speakerCounts[key] ?? 0
        const spkPct = ((spk / totalSpeakers) * 100).toFixed(1)
        row.push(`${spk.toLocaleString(locale)} (${spkPct}%)`)
      }
      return row
    })
  return formatMarkdownTable(
    hasSpk ? ['Gender', 'Clips', 'Speakers'] : ['Gender', 'Frequency'],
    rows,
  )
}

const buildAgeTable = (
  ageCounts: Record<string, number>,
  totalClips: number,
  locale: string = 'en',
  speakerCounts?: Record<string, number>,
  totalSpeakers?: number,
): string => {
  const hasSpk = speakerCounts && totalSpeakers != null && totalSpeakers > 0
  const rows: string[][] = Object.entries(ageCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => {
      const label = AGE_LABELS[key] ?? key
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      const row = [label, `${count.toLocaleString(locale)} (${pct}%)`]
      if (hasSpk) {
        const spk = speakerCounts[key] ?? 0
        const spkPct = ((spk / totalSpeakers) * 100).toFixed(1)
        row.push(`${spk.toLocaleString(locale)} (${spkPct}%)`)
      }
      return row
    })
  return formatMarkdownTable(
    hasSpk ? ['Age band', 'Clips', 'Speakers'] : ['Age band', 'Frequency'],
    rows,
  )
}

const SPLIT_NAMES = ['train', 'dev', 'test', 'validated', 'invalidated', 'other'] as const

export const buildDataSplitsTable = (
  buckets: Buckets,
  totalClips: number,
  locale: string = 'en',
): string => {
  const rows: [string, string][] = []

  for (const split of SPLIT_NAMES) {
    const count = buckets[split]
    if (count === 0) continue
    const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
    rows.push([
      split.charAt(0).toUpperCase() + split.slice(1),
      `${count.toLocaleString(locale)} (${pct}%)`,
    ])
  }

  if (rows.length === 0) return ''
  return formatMarkdownTable(['Split', 'Clips'], rows)
}

export const buildVariantStatsTable = (
  variantCounts: Record<string, number>,
  totalClips: number,
  locale: string = 'en',
  speakerCounts?: Record<string, number>,
  totalSpeakers?: number,
): string => {
  const entries = Object.entries(variantCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const hasSpk = speakerCounts && totalSpeakers != null && totalSpeakers > 0
  const rows: string[][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([variant, count]) => {
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      const row = [variant, `${count.toLocaleString(locale)} (${pct}%)`]
      if (hasSpk) {
        const spk = speakerCounts[variant] ?? 0
        const spkPct = ((spk / totalSpeakers) * 100).toFixed(1)
        row.push(`${spk.toLocaleString(locale)} (${spkPct}%)`)
      }
      return row
    })
  return formatMarkdownTable(
    hasSpk ? ['Variant', 'Clips', 'Speakers'] : ['Variant', 'Clips'],
    rows,
  )
}

/**
 * Filters accent counts into predefined (shown individually) and
 * user-submitted (grouped under "Other"). Accent keys from clips.tsv
 * are pipe-separated (e.g. "England English|Turkey English"); all parts
 * must be predefined for the entry to be shown individually.
 */
const filterAccentCounts = (
  accentCounts: Record<string, number>,
  predefinedNames: string[],
  speakerCounts?: Record<string, number>,
): {
  filteredCounts: Record<string, number>
  filteredSpeakers?: Record<string, number>
} => {
  const predefinedSet = new Set(predefinedNames)
  const filteredCounts: Record<string, number> = {}
  const filteredSpeakers: Record<string, number> | undefined = speakerCounts
    ? {}
    : undefined
  let otherClips = 0
  let otherSpeakers = 0

  for (const [accent, count] of Object.entries(accentCounts)) {
    const parts = accent.split('|').map(p => p.trim())
    const allPredefined = parts.every(p => predefinedSet.has(p))

    if (allPredefined) {
      filteredCounts[accent] = count
      if (filteredSpeakers && speakerCounts) {
        filteredSpeakers[accent] = speakerCounts[accent] ?? 0
      }
    } else {
      otherClips += count
      if (speakerCounts) {
        otherSpeakers += speakerCounts[accent] ?? 0
      }
    }
  }

  if (otherClips > 0) {
    filteredCounts['Other'] = (filteredCounts['Other'] ?? 0) + otherClips
    if (filteredSpeakers) {
      filteredSpeakers['Other'] =
        (filteredSpeakers['Other'] ?? 0) + otherSpeakers
    }
  }

  return { filteredCounts, filteredSpeakers }
}

/**
 * Resolves the code for an accent key. Compound keys (pipe-separated)
 * get their codes joined with `|`. Returns empty string for unknown accents.
 */
const resolveAccentCode = (
  accentKey: string,
  codeMap: Record<string, string>,
): string => {
  const parts = accentKey.split('|').map(p => p.trim())
  const codes = parts.map(p => codeMap[p] ?? '')
  return codes.join('|')
}

export const buildAccentStatsTable = (
  accentCounts: Record<string, number>,
  totalClips: number,
  locale: string = 'en',
  speakerCounts?: Record<string, number>,
  totalSpeakers?: number,
  predefinedNames?: string[],
  codeMap?: Record<string, string>,
): string => {
  let effectiveCounts = accentCounts
  let effectiveSpeakers = speakerCounts

  if (predefinedNames && predefinedNames.length > 0) {
    const filtered = filterAccentCounts(
      accentCounts,
      predefinedNames,
      speakerCounts,
    )
    effectiveCounts = filtered.filteredCounts
    effectiveSpeakers = filtered.filteredSpeakers
  }

  const entries = Object.entries(effectiveCounts).filter(
    ([, count]) => count > 0,
  )
  if (entries.length === 0) return ''
  const hasSpk =
    effectiveSpeakers && totalSpeakers != null && totalSpeakers > 0
  const hasCodes = codeMap && Object.keys(codeMap).length > 0
  const rows: string[][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([accent, count]) => {
      const pct =
        totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      const row: string[] = []
      if (hasCodes) {
        row.push(resolveAccentCode(accent, codeMap))
      }
      row.push(accent, `${count.toLocaleString(locale)} (${pct}%)`)
      if (hasSpk && effectiveSpeakers) {
        const spk = effectiveSpeakers[accent] ?? 0
        const spkPct = ((spk / totalSpeakers) * 100).toFixed(1)
        row.push(`${spk.toLocaleString(locale)} (${spkPct}%)`)
      }
      return row
    })

  const header: string[] = []
  if (hasCodes) header.push('Code')
  header.push('Accent', hasSpk ? 'Clips' : 'Clips')
  if (hasSpk) header.push('Speakers')

  return formatMarkdownTable(header, rows)
}

export const buildTextCorpusStatsTable = (
  data: Pick<LocaleReleaseData,
    'validatedSentences' | 'unvalidatedSentences' |
    'pendingSentences' | 'rejectedSentences' | 'reportedSentences'
  >,
  locale: string = 'en',
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
    .map(([label, v]) => [label, v.toLocaleString(locale)])
  if (rows.length === 0) return ''
  return formatMarkdownTable(['Category', 'Count'], rows)
}

export const buildSourcesStatsTable = (
  sourceCounts: Record<string, number>,
  locale: string = 'en',
): string => {
  const entries = Object.entries(sourceCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const total = entries.reduce((sum, [, c]) => sum + c, 0)
  const rows: [string, string][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([source, count]) => {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
      return [source, `${count.toLocaleString(locale)} (${pct}%)`]
    })
  return formatMarkdownTable(['Source', 'Sentences'], rows)
}

export const buildTextDomainStatsTable = (
  domainCounts: Record<string, number>,
  totalClips: number,
  locale: string = 'en',
  speakerCounts?: Record<string, number>,
  totalSpeakers?: number,
): string => {
  const entries = Object.entries(domainCounts).filter(([, count]) => count > 0)
  if (entries.length === 0) return ''
  const hasSpk = speakerCounts && totalSpeakers != null && totalSpeakers > 0
  const rows: string[][] = entries
    .sort(([, a], [, b]) => b - a)
    .map(([domain, count]) => {
      const pct = totalClips > 0 ? ((count / totalClips) * 100).toFixed(1) : '0'
      const row = [domain, `${count.toLocaleString(locale)} (${pct}%)`]
      if (hasSpk) {
        const spk = speakerCounts[domain] ?? 0
        const spkPct = ((spk / totalSpeakers) * 100).toFixed(1)
        row.push(`${spk.toLocaleString(locale)} (${spkPct}%)`)
      }
      return row
    })
  return formatMarkdownTable(
    hasSpk ? ['Domain', 'Clips', 'Speakers'] : ['Domain', 'Clips'],
    rows,
  )
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
  const lang = payload.metadata.template_language || 'en'

  // Metadata
  map['NATIVE_NAME'] = payload.metadata.native_name ?? locale
  map['ENGLISH_NAME'] = payload.metadata.english_name ?? locale
  map['LOCALE'] = locale
  map['VERSION'] = releaseName

  // Auto-generated stats — clip-level
  map['CLIPS'] = String(data.clips)
  map['HOURS_RECORDED'] = String(data.totalHrs)
  map['HOURS_VALIDATED'] = String(data.validHrs)
  map['SPEAKERS'] = String(data.speakers)
  map['VALIDATED_CLIPS'] = String(data.buckets.validated)
  map['INVALIDATED_CLIPS'] = String(data.buckets.invalidated)
  map['OTHER_CLIPS'] = String(data.buckets.other)
  map['AVG_DURATION_SECS'] = String(data.avgDurationSecs)

  // Auto-generated stats — sentence-level
  const totalSentences = data.validatedSentences + data.unvalidatedSentences
  map['TOTAL_SENTENCES'] = totalSentences.toLocaleString(lang)
  map['VALIDATED_SENTENCES'] = data.validatedSentences.toLocaleString(lang)
  map['UNVALIDATED_SENTENCES'] = data.unvalidatedSentences.toLocaleString(lang)
  map['PENDING_SENTENCES'] = data.pendingSentences.toLocaleString(lang)
  map['REJECTED_SENTENCES'] = data.rejectedSentences.toLocaleString(lang)
  map['REPORTED_SENTENCES'] = data.reportedSentences.toLocaleString(lang)

  // Demographics
  map['GENDER_TABLE'] = buildGenderTable(
    data.genderCounts, data.clips, lang,
    data.genderSpeakers, data.speakers,
  )
  map['AGE_TABLE'] = buildAgeTable(
    data.ageCounts, data.clips, lang,
    data.ageSpeakers, data.speakers,
  )

  // Data splits
  const splitsTable = buildDataSplitsTable(data.buckets, data.clips, lang)
  if (splitsTable) {
    map['DATA_SPLITS_TABLE'] = splitsTable
  }

  // Stats tables — keys match template {{PLACEHOLDER}} names
  const variantTable = buildVariantStatsTable(
    data.variantCounts, data.clips, lang,
    data.variantSpeakers, data.speakers,
  )
  if (variantTable) map['VARIANT_STATS'] = variantTable

  const accentTable = buildAccentStatsTable(
    data.accentCounts, data.clips, lang,
    data.accentSpeakers, data.speakers,
    data.predefinedAccentNames,
    data.accentCodeMap,
  )
  if (accentTable) map['ACCENT_STATS'] = accentTable

  const textCorpusTable = buildTextCorpusStatsTable(data, lang)
  if (textCorpusTable) map['TEXT_CORPUS_STATS'] = textCorpusTable

  const sourcesTable = buildSourcesStatsTable(data.sourceCounts, lang)
  if (sourcesTable) map['SOURCES_STATS'] = sourcesTable

  const domainTable = buildTextDomainStatsTable(
    data.domainCounts, data.clips, lang,
    data.domainSpeakers, data.speakers,
  )
  if (domainTable) map['TEXT_DOMAIN_STATS'] = domainTable

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

// -- Empty header cleanup ----------------------------------------------------

/**
 * Removes markdown headers that have no visible content in their section.
 * A section's content includes everything until the next header at the
 * same or higher level. Sub-headers count as content for their parent.
 *
 * Runs iteratively so that when all `###` sub-sections under a `##` are
 * removed, the now-empty `##` parent is also cleaned up.
 */
const removeEmptyHeaders = (text: string): string => {
  let prev = ''
  let current = text

  while (current !== prev) {
    prev = current
    const lines = current.split('\n')
    const kept: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const headerMatch = lines[i].match(/^(#{1,6})\s/)
      if (headerMatch) {
        const level = headerMatch[1].length
        let hasContent = false
        for (let j = i + 1; j < lines.length; j++) {
          const trimmed = lines[j].trim()
          if (trimmed === '') continue
          const nextMatch = trimmed.match(/^(#{1,6})\s/)
          if (nextMatch && nextMatch[1].length <= level) break
          hasContent = true
          break
        }
        if (!hasContent) continue
      }
      kept.push(lines[i])
    }

    current = kept.join('\n')
  }

  return current
}

// -- Template filling --------------------------------------------------------

/**
 * Fills a template string by replacing `{{KEY}}` and `<!-- {{KEY}} -->`
 * patterns with values from the replacement map.
 * Then strips all remaining HTML comment blocks and removes headers
 * left with no content.
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

  // Remove headers whose content was entirely stripped
  result = removeEmptyHeaders(result)

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
        if (license) {
          logger.debug(
            'DATASHEETS',
            `[${locale}] Skipping datasheets for licensed release`,
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
