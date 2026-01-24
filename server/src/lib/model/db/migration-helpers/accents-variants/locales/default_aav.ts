/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AAV_MAPPING_TYPE,
  findLocaleIdFromLocaleCode,
  findAccentIdFromToken,
  findVariantIdFromToken,
  findEligibleUsersForAccentToAccentAndVariantMigration,
  bulkInsertUserVariants,
  bulkUpdateUserAccents,
} from '../..'

const BATCH_SIZE = 100

/**
 * Migrates old accents to new accents AND variants simultaneously
 * This handles cases where old user-defined accents need to map to both a new accent and a variant
 *
 * Use cases:
 * - Migrating user-defined accents to predefined accents with regional variants
 * - Consolidating accent data while adding geographic/dialectal variant information
 * - Handling cases where accent and variant information should coexist
 *
 * @param db - Database connection
 * @param locale_code - Locale code (e.g., 'ro', 'fr', 'es')
 * @param mapping - Array of [old_accent_token, new_accent_token, variant_token, doDelete?]
 *                  - old_accent_token: The accent to migrate from
 *                  - new_accent_token: The accent to migrate to
 *                  - variant_token: The variant to add for the user
 *                  - doDelete: Whether to delete the old accent if unused (default: true)
 */
export const migrateAccentsToAccentsAndVariants_default = async (
  db: any,
  locale_code: string,
  mapping: AAV_MAPPING_TYPE
): Promise<any> => {
  // get locale_id
  const locale_id = await findLocaleIdFromLocaleCode(db, locale_code)
  if (!locale_id) {
    console.warn(`Specified locale does not exist: [${locale_code}]`)
    return null
  }

  // Loop through the mapping
  for (const [
    old_accent_token,
    new_accent_token,
    variant_token,
    doDelete = true,
  ] of mapping) {
    // get old_accent_id, new_accent_id and variant_id - fail if not found
    const old_accent_id = await findAccentIdFromToken(
      db,
      locale_id,
      old_accent_token
    )
    const new_accent_id = await findAccentIdFromToken(
      db,
      locale_id,
      new_accent_token
    )
    const variant_id = await findVariantIdFromToken(
      db,
      locale_id,
      variant_token
    )

    if (!old_accent_id) {
      console.warn(`Specified old accent does not exist: [${old_accent_token}]`)
      continue
    }
    if (!new_accent_id) {
      console.warn(`Specified new accent does not exist: [${new_accent_token}]`)
      continue
    }
    if (!variant_id) {
      console.warn(`Specified variant does not exist: [${variant_token}]`)
      continue
    }

    // Get eligible users - split into accent update and variant addition
    const eligibleUsers =
      await findEligibleUsersForAccentToAccentAndVariantMigration(
        db,
        locale_id,
        old_accent_id
      )
    if (!eligibleUsers) continue

    const { usersForAccentUpdate, usersForVariantAddition } = eligibleUsers

    // Batched/Bulk process for accent updates
    if (usersForAccentUpdate.length > 0) {
      for (let i = 0; i < usersForAccentUpdate.length; i += BATCH_SIZE) {
        const batch = usersForAccentUpdate.slice(i, i + BATCH_SIZE)
        await bulkUpdateUserAccents(
          db,
          locale_id,
          old_accent_id,
          new_accent_id,
          batch
        )
      }
    }

    // Batched/Bulk process for variant additions (only users without existing variants)
    if (usersForVariantAddition.length > 0) {
      for (let i = 0; i < usersForVariantAddition.length; i += BATCH_SIZE) {
        const batch = usersForVariantAddition.slice(i, i + BATCH_SIZE)
        await bulkInsertUserVariants(db, locale_id, variant_id, batch)
      }
    }

    // Remove the old accent if no one uses it anymore and doDelete is true
    if (doDelete) {
      try {
        const result = await db.runSql(
          `
          SELECT COUNT(*) as count
          FROM user_client_accents
          WHERE locale_id=? AND accent_id=?
        `,
          [locale_id, old_accent_id]
        )

        if (result && result[0] && Number(result[0].count) === 0) {
          await db.runSql(`DELETE FROM accents WHERE id=? LIMIT 1`, [
            old_accent_id,
          ])
        }
      } catch (err) {
        console.warn(
          `Failed to delete accent [${old_accent_token}]:`,
          err instanceof Error ? err.message : err
        )
      }
    }
  }
}
