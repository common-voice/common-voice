import {
  AV_MAPPING_TYPE,
  findLocaleIdFromLocaleCode,
  findAccentIdFromToken,
  findVariantIdFromToken,
  findEligibleUsersForAccentVariantMigration,
  bulkDeleteUserAccents,
  bulkInsertUserVariants,
} from '../..'

const BATCH_SIZE = 100

export const migrateAccentsToVariants_default = async (
  db: any,
  locale_code: string,
  mapping: AV_MAPPING_TYPE
): Promise<any> => {
  // get locale_id
  const locale_id = await findLocaleIdFromLocaleCode(db, locale_code)
  if (!locale_id) {
    console.warn(`Specified locale does not exist: [${locale_code}]`)
    return null
  }

  // Loop through the mapping
  for (const [accent_token, variant_token] of mapping) {
    // get accent_id and variant_id - fail if not found
    const accent_id = await findAccentIdFromToken(db, locale_id, accent_token)
    const variant_id = await findVariantIdFromToken(
      db,
      locale_id,
      variant_token
    )
    if (!accent_id) {
      console.warn(`Specified accent does not exist: [${accent_token}]`)
      continue
    }
    if (!variant_id) {
      console.warn(`Specified variant does not exist: [${variant_token}]`)
      continue
    }

    // Get all client_id's where the user has no variant defined, has a single predefined accent and that accent is accent_id
    const eligible_users = await findEligibleUsersForAccentVariantMigration(db, locale_id, accent_id)
    if (!eligible_users || eligible_users.length === 0) continue

    // Batched/Bulk process for large datasets
    for (let i = 0; i < eligible_users.length; i += BATCH_SIZE) {
      const batch = eligible_users.slice(i, i + BATCH_SIZE)
      await bulkInsertUserVariants(db, locale_id, variant_id, batch)
      await bulkDeleteUserAccents(db, locale_id, accent_id, batch)
    }

    // Remove the old accent if no one uses it anymore
    const [{ count }] = await db.runSql(
      `
        SELECT COUNT(*) as count
        FROM user_client_accents
        WHERE locale_id=? AND accent_id=?
      `,
      [locale_id, accent_id]
    )

    if (Number(count) === 0) {
      await db.runSql(`DELETE FROM accents WHERE id=? LIMIT 1`, [accent_id])
    }
  }
}
