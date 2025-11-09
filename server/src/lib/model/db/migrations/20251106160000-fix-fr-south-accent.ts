// This is only production specific migration
// Fixes missing French South accent
// It was caused because there is a user-defined accent with the same name
//
// The accent table has UNIQUE KEY `accent_key` (`locale_id`,`accent_name`)
// In 2024, somebody added a user-defined accent "Français du sud de la France"
// which blocked the creation of the predefined accent "fr-metro-south" with the same name
// during our 20251010200000-migrate-accents-variants-fr.ts migration
//
// We cannot directly delete the old user-defined one, because there may be users assigned to it (there are actually two of them in production)
//
// So the steps are:
// - Rename the old user-defined accent to "[DEPRECATED] Français du sud de la France"
// - Create the predefined accent "fr-metro-south"
// - Re-assign all users from the deprecated accent to the new predefined accent
// - Delete the deprecated accent
//
// We had to wrap everything in a transaction for safety
//
const LOCALE_CODE = 'fr'

const OLD_USER_ACCENT_CODE = 'français-du-sud-de-la-france'
const NEW_ACCENT_CODE = 'fr-metro-south'
const ACCENT_NAME = 'Français du sud de la France' // Same for both

//
// Do not change the code below unless database structure has been changed
//
import { findLocaleIdFromLocaleCode } from '../migration-helpers/'

export const up = async function (db: any): Promise<any> {
  // Use transaction for safety
  await db.runSql('START TRANSACTION')

  try {
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
      console.warn(`No rows updated for old accent: [${OLD_USER_ACCENT_CODE}]`)
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
      `UPDATE user_client_accents SET accent_id = ? WHERE locale_id = ? AND accent_id = ?`,
      [newAccentId, localeId, oldAccentId]
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
