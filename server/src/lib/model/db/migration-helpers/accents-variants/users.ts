// Eligibility criteria
// - users who already have variants set -> skip
// - users with exactly one predefined accent (excluding default "unspecified") matching the mapping -> migrate
// - users with multiple predefined accents -> skip
// - users with only user-submitted accents -> skip
export const findEligibleUsersForAccentVariantMigration = async (
  db: any,
  locale_id: number,
  accent_id: number,
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
    [locale_id, locale_id, accent_id])
  if (!rows || rows.length === 0) return null
  return rows.map((row) => row.client_id)
}
