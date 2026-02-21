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
 * Reads validated_sentences.tsv and returns a random sample of N sentences.
 * Only sentences with is_used == "1" are eligible.
 */
export const sampleSentences = (
  releaseDirPath: string,
  locale: string,
  count = 5,
): string[] => {
  const filepath = path.join(releaseDirPath, locale, 'validated_sentences.tsv')
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    if (lines.length <= 1) return [] // header only or empty

    // Column indices -- parse header
    const header = lines[0].split('\t')
    const sentenceIdx = header.indexOf('sentence')
    const isUsedIdx = header.indexOf('is_used')
    if (sentenceIdx < 0) return []

    const sentences = lines
      .slice(1)
      .filter(line => {
        if (isUsedIdx < 0) return true // column absent -- include all
        return line.split('\t')[isUsedIdx] === '1'
      })
      .map(line => line.split('\t')[sentenceIdx])
      .filter(s => s && s.trim().length > 0)

    // Reservoir sampling for random N
    const sample: string[] = []
    for (let i = 0; i < sentences.length; i++) {
      if (i < count) {
        sample.push(sentences[i])
      } else {
        const j = Math.floor(Math.random() * (i + 1))
        if (j < count) {
          sample[j] = sentences[i]
        }
      }
    }
    return sample
  } catch {
    return []
  }
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
 */
export const fillTemplate = (
  template: string,
  replacements: Record<string, string>,
): string => {
  let result = template

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

const datasheetPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  totalDurationInMs: number,
  payload: DatasheetLocalePayload,
  modality: string,
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
      buildReplacementMap(payload, autoStats, locale, releaseName, sentencesSample),
    ),
    TE.let('rendered', ({ replacements }) =>
      fillTemplate(payload.template, replacements),
    ),
    // 4. Write datasheet.md into locale directory (will be included in tar)
    TE.chainFirst(({ rendered }) =>
      TE.tryCatch(
        async () => {
          const datasheetPath = path.join(
            releaseDirPath,
            locale,
            'datasheet.md',
          )
          fs.writeFileSync(datasheetPath, rendered, 'utf-8')
          logger.info(
            'DATASHEETS',
            `[${locale}] Wrote datasheet.md (${rendered.length} bytes)`,
          )
        },
        reason => Error(String(reason)),
      ),
    ),
    // 5. Upload rendered datasheet to GCS under /datasheets/
    TE.chainFirst(({ rendered }) => {
      const templateLang = payload.metadata.template_language ?? 'en'
      const filename = license
        ? `${locale}-${sanitizeLicenseName(license)}.md`
        : `${locale}.md`
      const uploadPath = `${releaseName}/datasheets/${modality}/${templateLang}/${filename}`
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
      ({ locale, releaseName, releaseDirPath, datasheetPayload, license, modality }) => {
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
            modality ?? 'scripted',
            license,
          ),
          TE.map(() => undefined),
        )
      },
    ),
  )
