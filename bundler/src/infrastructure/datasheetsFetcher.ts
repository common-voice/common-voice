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

/**
 * Resolves the datasheets source to either a local file path or a full URL.
 * Supports:
 *   - Absolute path: "/path/to/file.json"
 *   - file:// URI: "file:///path/to/file.json"
 *   - Filename: "datasheets-v25.0-2026-03-06.json" (resolved against DATASHEETS_BASE_URL)
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
  if (datasheetsFile.startsWith('https://') || datasheetsFile.startsWith('http://')) {
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
 * Returns an empty map if datasheetsFile is not provided or the fetch fails
 * (non-blocking: the release proceeds without datasheets).
 */
export const fetchDatasheetsPayloads = (
  modality: Modality,
  datasheetsFile?: string,
): TE.TaskEither<Error, Map<string, DatasheetLocalePayload>> => {
  if (!datasheetsFile) {
    logger.info(
      'DATASHEETS',
      'No datasheets file specified, skipping datasheet generation',
    )
    return TE.right(new Map())
  }

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
