export const findVariantIdFromToken = async (
  db: any,
  locale_id: number,
  variant_token: string
): Promise<number | null> => {
  const [result] = await db.runSql(
    `
      SELECT id
      FROM variants
      WHERE locale_id = ?
        AND variant_token = ?
    `,
    [locale_id, variant_token]
  )
  return result?.id ? result.id : null
}

export const createNewUserVariantRecord = async (
  db: any,
  client_id: string,
  locale_id: number,
  variant_id: number
) => {
  await db.runSql(
    `
      INSERT INTO user_client_variants (client_id, locale_id, variant_id)
      VALUES (?, ?, ?)
    `,
    [client_id, locale_id, variant_id]
  )
}

export const bulkInsertUserVariants = async (
  db: any,
  locale_id: number,
  variant_id: number,
  clientIdBatch: string[]
): Promise<any> => {
  await db.runSql(
    `
      INSERT IGNORE INTO user_client_variants (client_id, locale_id, variant_id)
      VALUES ${clientIdBatch.map(() => '(?, ?, ?)').join(',')}
    `,
    clientIdBatch.flatMap(id => [id, locale_id, variant_id])
  )
}

export const changeVariantName = async (
  db: any,
  locale_id: number,
  variant_token: string,
  oldName: string,
  newName: string
): Promise<any> => {
  await db.runSql(
    `
      UPDATE variants SET variant_name = ?
      WHERE locale_id = ? AND variant_token = ? AND variant_name = ?
    `,
    [newName, locale_id, variant_token, oldName]
  )
}
