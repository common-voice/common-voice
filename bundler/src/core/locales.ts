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
// Delta locale selection
// ---------------------------------------------------------------------------
// Delta releases should only include locales that existed in the previous
// release (i.e., had clips before the delta window). New locales that got
// their first clips during the delta window belong in the next full release.
// Locales with 0 new clips still get a "clipless delta" (metadata-only).
//
// Boundary note: fetchLocalesWithClips(EPOCH, deltaFrom) uses SQL BETWEEN
// (inclusive). If the previous full release's `until` extends beyond
// `deltaFrom` (e.g. same day 23:59:59 vs 00:00:00), a locale whose only
// clips fall in that gap could be missed. In practice this is negligible —
// production locales have clips spanning months/years.
// ---------------------------------------------------------------------------

const EPOCH = '1970-01-01 00:00:00'

/**
 * For delta releases: fetch only locales that existed before the delta window.
 * Returns previous-release locales with their new clip count in the delta
 * window (0 for clipless deltas).
 */
export const fetchDeltaLocales = (
  deltaFrom: string,
  deltaUntil: string,
): TE.TaskEither<Error, LocalesWithClips[]> =>
  pipe(
    TE.Do,
    TE.bind('prevLocales', () => fetchLocalesWithClips(EPOCH, deltaFrom)),
    TE.bind('deltaClips', () => fetchLocalesWithClips(deltaFrom, deltaUntil)),
    TE.map(({ prevLocales, deltaClips }) => {
      const deltaMap = new Map(deltaClips.map(l => [l.name, l.clip_count]))
      return prevLocales.map(l => ({
        name: l.name,
        clip_count: deltaMap.get(l.name) ?? 0,
      }))
    }),
  )

/**
 * For delta releases: fetch only licensed locale-license combos that existed
 * before the delta window. Returns previous-release combos with their new
 * clip count in the delta window (0 for clipless deltas).
 */
export const fetchDeltaLicensedLocales = (
  deltaFrom: string,
  deltaUntil: string,
): TE.TaskEither<Error, LocaleWithLicense[]> =>
  pipe(
    TE.Do,
    TE.bind('prevLocales', () => fetchLocalesWithLicensedClips(EPOCH, deltaFrom)),
    TE.bind('deltaClips', () => fetchLocalesWithLicensedClips(deltaFrom, deltaUntil)),
    TE.map(({ prevLocales, deltaClips }) => {
      const key = (l: { name: string; license: string }) => `${l.name}|${l.license}`
      const deltaMap = new Map(deltaClips.map(l => [key(l), l.clip_count]))
      return prevLocales.map(l => ({
        name: l.name,
        license: l.license,
        clip_count: deltaMap.get(key(l)) ?? 0,
      }))
    }),
  )

// ---------------------------------------------------------------------------
// Accent metadata
// ---------------------------------------------------------------------------

type AccentRow = {
  accent_name: string
  accent_token: string | null
  user_submitted: number
}

type VariantRow = {
  variant_name: string
  variant_token: string | null
}

export type LocaleMetadata = {
  accentPredefinedNames: string[]
  accentCodeMap: Record<string, string>
  variantCodeMap: Record<string, string>
}

/**
 * Fetches accent and variant metadata for a locale in parallel.
 * - Accents: predefined names (for filtering) + name→code map (for display)
 * - Variants: name→code map (for display)
 */
export const fetchLocaleMetadata = (
  locale: string,
): TE.TaskEither<Error, LocaleMetadata> =>
  pipe(
    TE.Do,
    TE.bind('accents', () =>
      query<AccentRow[]>(
        `SELECT accent_name, accent_token, user_submitted FROM accents
         WHERE locale_id = (SELECT id FROM locales WHERE name = ?)
           AND accent_name != ''
           AND accent_name != 'unspecified'`,
        [locale],
      ),
    ),
    TE.bind('variants', () =>
      query<VariantRow[]>(
        `SELECT variant_name, variant_token FROM variants
         WHERE locale_id = (SELECT id FROM locales WHERE name = ?)
           AND variant_name != ''`,
        [locale],
      ),
    ),
    TE.map(({ accents, variants }) => {
      const accentPredefinedNames: string[] = []
      const accentCodeMap: Record<string, string> = {}

      for (const row of accents) {
        if (row.accent_token) {
          accentCodeMap[row.accent_name] = row.accent_token
        }
        if (!row.user_submitted) {
          accentPredefinedNames.push(row.accent_name)
        }
      }

      const variantCodeMap: Record<string, string> = {}
      for (const row of variants) {
        if (row.variant_token) {
          variantCodeMap[row.variant_name] = row.variant_token
        }
      }

      return { accentPredefinedNames, accentCodeMap, variantCodeMap }
    }),
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
