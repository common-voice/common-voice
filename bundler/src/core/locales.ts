import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { query } from '../infrastructure/database'
import { getQueriesDir } from '../config/config'
import { LocaleWithLicense, VariantInfo } from '../types'

export type LocalesWithClips = {
  name: string
  clip_count: number
}

export const fetchLocalesWithClips = (
  includeClipsFrom: string,
  includeClipsUntil: string,
) =>
  pipe(
    query<[LocalesWithClips]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getAllLocalesWithClips.sql'),
        { encoding: 'utf-8' },
      ),
      [includeClipsFrom, includeClipsUntil],
    ),
  )

export const fetchLocalesWithLicensedClips = (
  includeClipsFrom: string,
  includeClipsUntil: string,
) =>
  pipe(
    query<[LocaleWithLicense]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getLocalesWithLicensedClips.sql'),
        { encoding: 'utf-8' },
      ),
      [includeClipsFrom, includeClipsUntil],
    ),
  )

// ---------------------------------------------------------------------------
// Variant clip queries
// ---------------------------------------------------------------------------

type VariantClipRow = {
  locale: string
  variant_token: string
  variant_name: string
  clip_count: number
}

export type LocaleVariantGroup = {
  locale: string
  variants: VariantInfo[]
  totalClipCount: number
}

export const fetchLocalesWithVariantClips = (
  includeClipsFrom: string,
  includeClipsUntil: string,
): TE.TaskEither<Error, LocaleVariantGroup[]> =>
  pipe(
    query<[VariantClipRow]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getLocalesWithVariantClips.sql'),
        { encoding: 'utf-8' },
      ),
      [includeClipsFrom, includeClipsUntil],
    ),
    TE.map((rows: VariantClipRow[]) => {
      const grouped = new Map<string, { variants: VariantInfo[]; totalClipCount: number }>()
      for (const row of rows) {
        let group = grouped.get(row.locale)
        if (!group) {
          group = { variants: [], totalClipCount: 0 }
          grouped.set(row.locale, group)
        }
        group.variants.push({
          variantToken: row.variant_token,
          variantName: row.variant_name,
          clipCount: Number(row.clip_count),
        })
        group.totalClipCount += Number(row.clip_count)
      }
      return Array.from(grouped.entries()).map(([locale, group]) => ({
        locale,
        ...group,
      }))
    }),
  )
