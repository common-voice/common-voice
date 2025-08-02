export const findAccentIdFromToken = async (
  db: any,
  locale_id: number,
  accent_token: string
): Promise<number | null> => {
  const [result] = await db.runSql(
    `
      SELECT id
      FROM accents
      WHERE locale_id = ?
        AND accent_token = ?
    `,
    [locale_id, accent_token]
  )
  return result?.id ? result.id : null
}

export const bulkDeleteUserAccents = async (
  db: any,
  locale_id: number,
  accent_id: number,
  clientIdBatch: string[]
): Promise<any> => {
  await db.runSql(
    `
      DELETE FROM user_client_accents
      WHERE locale_id=? AND accent_id=?
        AND client_id IN (${clientIdBatch.map(() => '?').join(',')})
    `,
    [locale_id, accent_id, ...clientIdBatch]
  )
}
