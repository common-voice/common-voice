// This is only production specific migration
// Fixes missing Romanian accents we added in https://github.com/common-voice/common-voice/pull/5220
// It was caused because there were two user-defined accent with the same name
//
// This is extended from the migration: 20251215070000-fix-fr-accent.ts
//
// Steps are this time executed in a loop for both accents:
// - Rename the old user-defined accent to "[DEPRECATED] *accent_name*"
// - Create the predefined accent "*accent_token*"
// - Re-assign all users from the deprecated accent to the new predefined accent
// - Delete the deprecated accent
//
// We had to wrap everything in a transaction for safety
//
const LOCALE_CODE = 'ro'

const OLD_USER_ACCENT_CODES = ['moldovenesc', 'oltenesc']
const NEW_ACCENT_CODES = ['ro-moldova', 'ro-oltenia']
const ACCENT_NAMES = ['Moldovenesc', 'Oltenesc'] // Same for both old and new

//
// Do not change the code below unless database structure has been changed
//
import { findLocaleIdFromLocaleCode } from '../migration-helpers/'

export const up = async function (db: any): Promise<any> {
  // Use transaction for safety
  await db.runSql('START TRANSACTION')

  try {
    for (let i = 0; i < OLD_USER_ACCENT_CODES.length; i++) {
      const OLD_USER_ACCENT_CODE = OLD_USER_ACCENT_CODES[i]
      const NEW_ACCENT_CODE = NEW_ACCENT_CODES[i]
      const ACCENT_NAME = ACCENT_NAMES[i]

      // Have some data ready
      const deprecatedName = `[DEPRECATED] ${ACCENT_NAME}`
      const localeId = await findLocaleIdFromLocaleCode(db, LOCALE_CODE)

      if (!localeId) {
        console.warn(`Locale not found: [${LOCALE_CODE}]`)
        await db.runSql('ROLLBACK')
        return null
      }

      // Check if new accent already exists
      const existingNewAccentRows = await db.runSql(
        `SELECT id FROM accents WHERE locale_id = ? AND accent_token = ?`,
        [localeId, NEW_ACCENT_CODE]
      )

      if (existingNewAccentRows && existingNewAccentRows.length > 0) {
        console.log(`New accent already exists: [${NEW_ACCENT_CODE}]`)
        await db.runSql('ROLLBACK')
        return null
      }

      const oldAccentRows = await db.runSql(
        `SELECT id FROM accents WHERE locale_id = ? AND accent_token = ?`,
        [localeId, OLD_USER_ACCENT_CODE]
      )

      if (!oldAccentRows || oldAccentRows.length === 0) {
        console.warn(
          `Old user-defined accent not found: [${OLD_USER_ACCENT_CODE}]`
        )
        await db.runSql('ROLLBACK')
        return null
      }

      const oldAccentId = oldAccentRows[0].id

      // UPDATE the offending user-defined accent's name field
      const updateResult = await db.runSql(
        `UPDATE accents SET accent_name = ? WHERE locale_id = ? AND accent_token = ? AND id = ?`,
        [deprecatedName, localeId, OLD_USER_ACCENT_CODE, oldAccentId]
      )

      if (updateResult.affectedRows === 0) {
        console.warn(
          `No rows updated for old accent: [${OLD_USER_ACCENT_CODE}]`
        )
        await db.runSql('ROLLBACK')
        return null
      }

      // INSERT the new accent - use regular INSERT (not IGNORE) since we checked existence
      const insertResult = await db.runSql(
        `INSERT INTO accents(locale_id, accent_name, accent_token) VALUES (?,?,?)`,
        [localeId, ACCENT_NAME, NEW_ACCENT_CODE]
      )

      const newAccentId = insertResult.insertId

      if (!newAccentId || newAccentId <= 0) {
        console.warn(`New accent not created, insertId: [${newAccentId}]`)
        await db.runSql('ROLLBACK')
        return null
      }

      // UPDATE user_client_accents records
      const updateUserAccents = await db.runSql(
        `UPDATE user_client_accents SET accent_id = ?, accent_token = ? WHERE locale_id = ? AND accent_id = ?`,
        [newAccentId, NEW_ACCENT_CODE, localeId, oldAccentId]
      )

      console.log(
        `Updated ${updateUserAccents.affectedRows} user_client_accents records`
      )

      // DELETE the deprecated user defined accent
      await db.runSql(`DELETE FROM accents WHERE id = ?`, [oldAccentId])

      // Commit transaction
      await db.runSql('COMMIT')
      console.log(
        `Successfully migrated accent from ${OLD_USER_ACCENT_CODE} to ${NEW_ACCENT_CODE}`
      )
    }
    return null
  } catch (error) {
    // We rollback on any error
    await db.runSql('ROLLBACK')
    console.error('Migration failed, rolled back:', error)
    throw error
  }
}

export const down = async function (): Promise<null> {
  // We cannot take it back safely
  console.warn('This migration cannot be safely rolled back')
  return null
}
