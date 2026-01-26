/* eslint-disable @typescript-eslint/no-explicit-any */
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
  if (clientIdBatch.length === 0) return

  try {
    await db.runSql(
      `
        INSERT IGNORE INTO user_client_variants (client_id, locale_id, variant_id)
        VALUES ${clientIdBatch.map(() => '(?, ?, ?)').join(',')}
      `,
      clientIdBatch.flatMap(id => [id, locale_id, variant_id])
    )
  } catch (err: any) {
    // If batch insert fails, try one-by-one
    console.warn(
      `Batch insert failed for ${clientIdBatch.length} user(s), processing individually...`
    )

    for (const client_id of clientIdBatch) {
      try {
        await db.runSql(
          `
            INSERT IGNORE INTO user_client_variants (client_id, locale_id, variant_id)
            VALUES (?, ?, ?)
          `,
          [client_id, locale_id, variant_id]
        )
      } catch (individualErr: any) {
        console.warn(
          `Failed to insert variant for user ${client_id.substring(0, 8)}...:`,
          individualErr.message
        )
        // Continue with remaining users
      }
    }
  }
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
