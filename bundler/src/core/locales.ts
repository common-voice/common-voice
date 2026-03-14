import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { query } from '../infrastructure/database'
import { getQueriesDir } from '../config'
import { LocaleWithLicense, VariantInfo } from '../types'
import { logger } from '../infrastructure/logger'

export type LocalesWithClips = {
  name: string
  clip_count: number
}

type LocaleVoteCount = {
  name: string
  vote_count: number
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

export const fetchLocalesWithVotes = (
  includeVotesFrom: string,
  includeVotesUntil: string,
) =>
  pipe(
    query<[LocaleVoteCount]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getLocalesWithVotes.sql'),
        { encoding: 'utf-8' },
      ),
      [includeVotesFrom, includeVotesUntil],
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
// Delta releases only include locales that existed in the previous release
// (i.e., had clips before the delta window). New locales that got their first
// clips during the delta window belong in the next full release.
//
// Passive locales (0 new clips AND 0 new votes) are skipped entirely -- they
// would produce identical output to the previous release. Only locales with
// at least one new clip or vote are enqueued.
//
// Boundary note: fetchLocalesWithClips(EPOCH, deltaFrom) uses SQL BETWEEN
// (inclusive). If the previous full release's `until` extends beyond
// `deltaFrom` (e.g. same day 23:59:59 vs 00:00:00), a locale whose only
// clips fall in that gap could be missed. In practice this is negligible --
// production locales have clips spanning months/years.
// ---------------------------------------------------------------------------

const EPOCH = '1970-01-01 00:00:00'

/**
 * For delta releases: fetch only locales that existed before the delta window
 * AND have at least one new clip or vote in the delta window.
 * Passive locales (no clips, no votes) are skipped with a log message.
 */
export const fetchDeltaLocales = (
  deltaFrom: string,
  deltaUntil: string,
): TE.TaskEither<Error, LocalesWithClips[]> =>
  pipe(
    TE.Do,
    TE.bind('prevLocales', () => fetchLocalesWithClips(EPOCH, deltaFrom)),
    TE.bind('deltaClips', () => fetchLocalesWithClips(deltaFrom, deltaUntil)),
    TE.bind('deltaVotes', () => fetchLocalesWithVotes(deltaFrom, deltaUntil)),
    TE.map(({ prevLocales, deltaClips, deltaVotes }) => {
      const clipMap = new Map(deltaClips.map(l => [l.name, l.clip_count]))
      const voteMap = new Map(deltaVotes.map(l => [l.name, l.vote_count]))

      const active: LocalesWithClips[] = []
      const skipped: string[] = []

      for (const l of prevLocales) {
        const clips = clipMap.get(l.name) ?? 0
        const votes = voteMap.get(l.name) ?? 0
        if (clips > 0 || votes > 0) {
          active.push({ name: l.name, clip_count: clips })
        } else {
          skipped.push(l.name)
        }
      }

      if (skipped.length > 0) {
        for (let i = 0; i < skipped.length; i += 10) {
          const chunk = skipped.slice(i, i + 10)
          logger.info(
            'SKIP',
            `${skipped.length} passive locale(s) skipped (${i + 1}-${i + chunk.length}/${skipped.length}): ${chunk.join(', ')}`,
          )
        }
      }

      return active
    }),
  )

/**
 * For delta releases: fetch only licensed locale-license combos that existed
 * before the delta window AND have at least one new clip or vote.
 * Passive locales are skipped (vote check is per-locale, not per-license).
 */
export const fetchDeltaLicensedLocales = (
  deltaFrom: string,
  deltaUntil: string,
): TE.TaskEither<Error, LocaleWithLicense[]> =>
  pipe(
    TE.Do,
    TE.bind('prevLocales', () => fetchLocalesWithLicensedClips(EPOCH, deltaFrom)),
    TE.bind('deltaClips', () => fetchLocalesWithLicensedClips(deltaFrom, deltaUntil)),
    TE.bind('deltaVotes', () => fetchLocalesWithVotes(deltaFrom, deltaUntil)),
    TE.map(({ prevLocales, deltaClips, deltaVotes }) => {
      const key = (l: { name: string; license: string }) => `${l.name}|${l.license}`
      const clipMap = new Map(deltaClips.map(l => [key(l), l.clip_count]))
      const voteMap = new Map(deltaVotes.map(l => [l.name, l.vote_count]))

      const active: LocaleWithLicense[] = []
      const skipped: string[] = []

      for (const l of prevLocales) {
        const clips = clipMap.get(key(l)) ?? 0
        const votes = voteMap.get(l.name) ?? 0
        if (clips > 0 || votes > 0) {
          active.push({ name: l.name, license: l.license, clip_count: clips })
        } else {
          skipped.push(`${l.name}|${l.license}`)
        }
      }

      if (skipped.length > 0) {
        for (let i = 0; i < skipped.length; i += 10) {
          const chunk = skipped.slice(i, i + 10)
          logger.info(
            'SKIP',
            `${skipped.length} passive licensed locale(s) skipped (${i + 1}-${i + chunk.length}/${skipped.length}): ${chunk.join(', ')}`,
          )
        }
      }

      return active
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
