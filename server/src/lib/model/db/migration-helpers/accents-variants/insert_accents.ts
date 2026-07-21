/* eslint-disable @typescript-eslint/no-explicit-any */
import { findLocaleIdFromLocaleCode } from '../'
import { NEW_ACCENT_TYPE } from './types'

/**
 * Inserts new predefined accents for a locale.
 *
 * For each accent in the list:
 *   - If the predefined accent already exists (by token) → skip (idempotent)
 *   - If a user-submitted accent with the same name is blocking insertion
 *     (UNIQUE KEY on locale_id, accent_name) → rename blocker to [DEPRECATED],
 *     insert the new predefined accent, migrate all users, delete the blocker
 *   - If no conflict → insert directly
 *
 * Each accent runs in its own transaction. On error: rollback that accent,
 * warn, and continue to the next. Never throws — safe on any DB state,
 * including single-language clones and clean installs.
 *
 * @param db          - Database connection
 * @param locale_code - Locale code (e.g. 'fy-NL', 'fr', 'ro')
 * @param accents     - Array of [accent_token, accent_name] tuples
 */
export const insertNewAccents = async (
  db: any,
  locale_code: string,
  accents: NEW_ACCENT_TYPE
): Promise<void> => {
  // Resolve locale once — warn and bail early on clones / single-language installs
  const locale_id = await findLocaleIdFromLocaleCode(db, locale_code)
  if (!locale_id) {
    console.warn(
      `[insertNewAccents] Locale not found: [${locale_code}] — skipping all accents`
    )
    return
  }

  for (const [accent_token, accent_name] of accents) {
    try {
      await db.runSql('START TRANSACTION')

      // 1. Skip if predefined accent already exists (re-run safety / idempotent)
      const [existing] = await db.runSql(
        `SELECT id FROM accents WHERE locale_id = ? AND accent_token = ?`,
        [locale_id, accent_token]
      )
      if (existing) {
        console.log(
          `[insertNewAccents] Already exists: [${accent_token}] — skipping`
        )
        await db.runSql('ROLLBACK')
        continue
      }

      // 2. Find a user-submitted accent blocking insertion (same locale + name)
      const [blocker] = await db.runSql(
        `SELECT id FROM accents WHERE locale_id = ? AND accent_name = ? AND user_submitted = 1`,
        [locale_id, accent_name]
      )

      if (blocker) {
        const blocker_id: number = blocker.id
        const deprecated_name = `[DEPRECATED] ${accent_name}`

        // 2a. Rename blocker to free up the unique name slot
        await db.runSql(`UPDATE accents SET accent_name = ? WHERE id = ?`, [
          deprecated_name,
          blocker_id,
        ])

        // 2b. Insert the new predefined accent
        const insertResult = await db.runSql(
          `INSERT INTO accents (locale_id, accent_name, accent_token) VALUES (?, ?, ?)`,
          [locale_id, accent_name, accent_token]
        )
        const new_accent_id: number = insertResult.insertId

        if (!new_accent_id || new_accent_id <= 0) {
          console.warn(
            `[insertNewAccents] Insert failed for [${accent_token}] (insertId: ${new_accent_id}) — rolled back`
          )
          await db.runSql('ROLLBACK')
          continue
        }

        // 2c. Migrate users from blocker to new predefined accent
        const updateResult = await db.runSql(
          `UPDATE user_client_accents
           SET accent_id = ?, accent_token = ?
           WHERE locale_id = ? AND accent_id = ?`,
          [new_accent_id, accent_token, locale_id, blocker_id]
        )
        console.log(
          `[insertNewAccents] Migrated ${updateResult.affectedRows} user(s) to [${accent_token}]`
        )

        // 2d. Delete the blocker accent
        await db.runSql(`DELETE FROM accents WHERE id = ?`, [blocker_id])

        await db.runSql('COMMIT')
        console.log(
          `[insertNewAccents] Inserted [${accent_token}] — conflict resolved`
        )
      } else {
        // 3. No conflict — insert directly
        const insertResult = await db.runSql(
          `INSERT INTO accents (locale_id, accent_name, accent_token) VALUES (?, ?, ?)`,
          [locale_id, accent_name, accent_token]
        )
        const new_accent_id: number = insertResult.insertId

        if (!new_accent_id || new_accent_id <= 0) {
          console.warn(
            `[insertNewAccents] Insert failed for [${accent_token}] (insertId: ${new_accent_id}) — rolled back`
          )
          await db.runSql('ROLLBACK')
          continue
        }

        await db.runSql('COMMIT')
        console.log(`[insertNewAccents] Inserted [${accent_token}]`)
      }
    } catch (error) {
      try {
        await db.runSql('ROLLBACK')
      } catch {
        // ignore rollback errors
      }
      console.warn(
        `[insertNewAccents] Error on [${accent_token}], rolled back — continuing:`,
        error instanceof Error ? error.message : error
      )
    }
  }
}
