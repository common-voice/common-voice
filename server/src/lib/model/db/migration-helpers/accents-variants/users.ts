/* eslint-disable @typescript-eslint/no-explicit-any */
// Eligibility criteria
// - users who already have variants set -> skip
// - users with exactly one predefined accent (excluding default "unspecified") matching the mapping -> migrate
// - users with multiple predefined accents -> skip
// - users with only user-submitted accents -> skip
export const findEligibleUsersForAccentVariantMigration = async (
  db: any,
  locale_id: number,
  accent_id: number
): Promise<string[] | null> => {
  const rows: { client_id: string }[] = await db.runSql(
    `
      SELECT DISTINCT uca.client_id
      FROM user_client_accents uca
      JOIN accents a ON uca.accent_id = a.id
      LEFT JOIN user_client_variants ucv
        ON uca.client_id = ucv.client_id AND ucv.locale_id = ?
      WHERE uca.locale_id = ?
      GROUP BY uca.client_id
      HAVING
        COUNT(DISTINCT CASE WHEN a.user_submitted=0 AND a.accent_token != 'unspecified' THEN uca.accent_id END) = 1
        AND SUM(CASE WHEN a.user_submitted=0 AND a.accent_token != 'unspecified' AND uca.accent_id = ? THEN 1 ELSE 0 END) = 1
        AND COUNT(DISTINCT ucv.id) = 0
    `,
    [locale_id, locale_id, accent_id]
  )
  if (!rows || rows.length === 0) return null
  return rows.map(row => row.client_id)
}

// Eligibility criteria for accent-to-accent-and-variant migration
// - users who already have variants set -> skip setting variant (but do not skip accent update if eligible)
// - users with exactly one predefined accent (excluding default "unspecified") matching the mapping -> migrate
// - users with multiple predefined accents -> handle migration for matching old accent only
// - users with only user-submitted accents -> handle migration for matching old accent only
export const findEligibleUsersForAccentToAccentAndVariantMigration = async (
  db: any,
  locale_id: number,
  old_accent_id: number
): Promise<{
  usersForAccentUpdate: string[]
  usersForVariantAddition: string[]
} | null> => {
  // Get ALL users with the old accent (for accent update)
  const allUsersRows: { client_id: string }[] = await db.runSql(
    `
      SELECT DISTINCT client_id
      FROM user_client_accents
      WHERE locale_id = ? AND accent_id = ?
    `,
    [locale_id, old_accent_id]
  )

  if (!allUsersRows || allUsersRows.length === 0) return null

  const allUsers = allUsersRows.map(row => row.client_id)

  // Get users who DON'T have any variant set for this locale (for variant addition)
  const usersWithoutVariantRows: { client_id: string }[] = await db.runSql(
    `
      SELECT DISTINCT uca.client_id
      FROM user_client_accents uca
      LEFT JOIN user_client_variants ucv
        ON uca.client_id = ucv.client_id AND ucv.locale_id = ?
      WHERE uca.locale_id = ?
        AND uca.accent_id = ?
        AND ucv.id IS NULL
    `,
    [locale_id, locale_id, old_accent_id]
  )

  const usersWithoutVariant = usersWithoutVariantRows.map(row => row.client_id)

  return {
    usersForAccentUpdate: allUsers,
    usersForVariantAddition: usersWithoutVariant,
  }
}

export const bulkUpdateUserAccents = async (
  db: any,
  locale_id: number,
  old_accent_id: number,
  new_accent_id: number,
  clientIdBatch: string[]
): Promise<any> => {
  await db.runSql(
    `
      UPDATE user_client_accents
      SET accent_id = ?
      WHERE locale_id = ? AND accent_id = ?
        AND client_id IN (${clientIdBatch.map(() => '?').join(',')})
    `,
    [new_accent_id, locale_id, old_accent_id, ...clientIdBatch]
  )
}
