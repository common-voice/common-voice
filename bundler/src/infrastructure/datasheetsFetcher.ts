import * as fs from 'node:fs'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { logger } from './logger'
import {
  DATASHEETS_BASE_URL,
  Modality,
  MODALITY_TO_DATASHEETS_KEY,
} from '../config/config'
import { DatasheetLocalePayload } from '../types'

export type DatasheetsJson = {
  schema_version: string
  generated_at: string
  source_version?: string
  templates: Record<string, Record<string, string>>
  locales: Record<string, Record<string, DatasheetsLocaleEntry>>
}

type DatasheetsLocaleEntry = {
  template_language: string
  metadata: Record<string, string>
  community_fields: Record<string, string>
}

/** Supported major schema version. Bump when breaking changes are made. */
const SUPPORTED_MAJOR_VERSION = 2

/**
 * Validates the top-level structure of a parsed datasheets JSON.
 * Returns an array of warning strings (empty = valid).
 * Warnings are logged but do NOT block the pipeline.
 */
export const validateDatasheetsJson = (
  data: unknown,
): string[] => {
  const warnings: string[] = []
  if (data == null || typeof data !== 'object') {
    return ['Datasheets JSON is not an object']
  }

  const obj = data as Record<string, unknown>

  // schema_version
  if (typeof obj.schema_version !== 'string') {
    warnings.push('Missing or non-string "schema_version"')
  } else if (!/^\d+\.\d+\.\d+$/.test(obj.schema_version)) {
    warnings.push(`Invalid schema_version format: "${obj.schema_version}" (expected semver)`)
  } else {
    const major = Number(obj.schema_version.split('.')[0])
    if (major !== SUPPORTED_MAJOR_VERSION) {
      warnings.push(
        `Unsupported schema major version ${major} (expected ${SUPPORTED_MAJOR_VERSION}). ` +
        `The bundler may not interpret all fields correctly.`,
      )
    }
  }

  // required top-level fields
  for (const key of ['generated_at', 'source_version', 'templates', 'locales'] as const) {
    if (obj[key] == null) {
      warnings.push(`Missing required field "${key}"`)
    }
  }

  // templates structure
  if (obj.templates != null && typeof obj.templates === 'object') {
    for (const [mod, tplSet] of Object.entries(obj.templates as Record<string, unknown>)) {
      if (tplSet == null || typeof tplSet !== 'object') {
        warnings.push(`templates.${mod} is not an object`)
        continue
      }
      const langs = Object.keys(tplSet as Record<string, unknown>)
      if (langs.length === 0) {
        warnings.push(`templates.${mod} has no template languages`)
      }
    }
  }

  // locales structure (spot-check first entry per modality)
  if (obj.locales != null && typeof obj.locales === 'object') {
    for (const [mod, localeSet] of Object.entries(obj.locales as Record<string, unknown>)) {
      if (localeSet == null || typeof localeSet !== 'object') {
        warnings.push(`locales.${mod} is not an object`)
        continue
      }
      const entries = Object.entries(localeSet as Record<string, unknown>)
      if (entries.length === 0) continue
      const [sampleLocale, sampleEntry] = entries[0]
      if (sampleEntry == null || typeof sampleEntry !== 'object') {
        warnings.push(`locales.${mod}.${sampleLocale} is not an object`)
        continue
      }
      const entry = sampleEntry as Record<string, unknown>
      for (const field of ['template_language', 'metadata', 'community_fields'] as const) {
        if (entry[field] == null) {
          warnings.push(`locales.${mod}.${sampleLocale} missing "${field}"`)
        }
      }
      if (entry.metadata != null && typeof entry.metadata === 'object') {
        const meta = entry.metadata as Record<string, unknown>
        for (const field of ['native_name', 'english_name'] as const) {
          if (typeof meta[field] !== 'string') {
            warnings.push(`locales.${mod}.${sampleLocale}.metadata missing "${field}"`)
          }
        }
      }
    }
  }

  return warnings
}

/**
 * Resolves the datasheets source to either a local file path or a full URL.
 * Supports:
 *   - Absolute path: "/path/to/file.json"
 *   - file:// URI: "file:///path/to/file.json"
 *   - Filename: "datasheets-25.0-2026-03-06.json" (resolved against DATASHEETS_BASE_URL)
 */
const resolveSource = (
  datasheetsFile: string,
): { type: 'local'; path: string } | { type: 'remote'; url: string } => {
  if (datasheetsFile.startsWith('file://')) {
    return { type: 'local', path: datasheetsFile.slice('file://'.length) }
  }
  if (datasheetsFile.startsWith('/')) {
    return { type: 'local', path: datasheetsFile }
  }
  if (
    datasheetsFile.startsWith('https://') ||
    datasheetsFile.startsWith('http://')
  ) {
    return { type: 'remote', url: datasheetsFile }
  }
  return {
    type: 'remote',
    url: `${DATASHEETS_BASE_URL}/${datasheetsFile}`,
  }
}

/**
 * Fetches the pre-compiled datasheets.json from the cv-datasheets repo
 * (or a local file for testing).
 * The caller always provides a datasheetsFile (defaulting to `{releaseName}.json`).
 * Returns an empty map if the fetch fails (non-blocking: release proceeds without datasheets).
 */
export const fetchDatasheetsPayloads = (
  modality: Modality,
  datasheetsFile: string,
): TE.TaskEither<Error, Map<string, DatasheetLocalePayload>> => {
  const datasheetsKey = MODALITY_TO_DATASHEETS_KEY[modality] ?? modality
  const source = resolveSource(datasheetsFile)

  const loadJson = TE.tryCatch(
    async (): Promise<DatasheetsJson> => {
      if (source.type === 'local') {
        logger.info(
          'DATASHEETS',
          `Reading datasheets from local file ${source.path}`,
        )
        const content = fs.readFileSync(source.path, 'utf-8')
        return JSON.parse(content) as DatasheetsJson
      }

      logger.info('DATASHEETS', `Fetching datasheets from ${source.url}`)
      const response = await fetch(source.url)
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} fetching ${source.url}`,
        )
      }
      return (await response.json()) as DatasheetsJson
    },
    reason => Error(String(reason)),
  )

  return pipe(
    loadJson,
    TE.chainFirst(data => {
      const warnings = validateDatasheetsJson(data)
      for (const w of warnings) {
        logger.warn('DATASHEETS', `Schema validation: ${w}`)
      }
      return TE.right(data)
    }),
    TE.map(data => {
      const templates = data.templates[datasheetsKey] ?? {}
      const locales = data.locales[datasheetsKey] ?? {}
      const payloads = new Map<string, DatasheetLocalePayload>()

      for (const [locale, entry] of Object.entries(locales)) {
        const template = templates[entry.template_language]
        if (!template) {
          logger.warn(
            'DATASHEETS',
            `No ${datasheetsKey} template for language "${entry.template_language}" (locale ${locale}), skipping`,
          )
          continue
        }
        payloads.set(locale, {
          template,
          community_fields: entry.community_fields,
          metadata: {
            ...entry.metadata,
            template_language: entry.template_language,
          },
        })
      }

      logger.info(
        'DATASHEETS',
        `Loaded datasheet payloads for ${payloads.size} ${modality} locales`,
      )
      return payloads
    }),
    TE.orElse(err => {
      logger.warn(
        'DATASHEETS',
        `Failed to fetch datasheets, proceeding without: ${err.message}`,
      )
      return TE.right(new Map())
    }),
  )
}
