import { findLocaleIdFromLocaleCode } from '../'

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
  return result?.id ?? null
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

// This is for final clean-up - use with care
export const bulkDeleteAccentsWithReferences = async (
  db: any,
  locale_code: string,
  accent_tokens: string[]
): Promise<any> => {
  // get locale_id
  const locale_id = await findLocaleIdFromLocaleCode(db, locale_code)
  if (!locale_id) {
    console.warn(`Specified locale does not exist: [${locale_code}]`)
    return null
  }

  // get a list of accent_ids, because only they are guarantied to be in user_client_accents
  // omit if they are not there anymore
  const promises = accent_tokens.map(accent_token =>
    findAccentIdFromToken(db, locale_id, accent_token)
  );
  const results = await Promise.all(promises);
  const accent_ids = results.filter(id => id !== null);

  // cancel process if none found
  if (accent_ids.length === 0) {
    console.warn(`No specified accent found: [${accent_tokens.join(',')}]`)
    return null
  }

  // now we can delete them from user_client_accents
  const qq = accent_ids.map(() => '?').join(',')
  await db.runSql(
    `
      DELETE FROM user_client_accents
      WHERE locale_id=?
        AND accent_id IN (${qq})
    `,
    [locale_id, ...accent_ids]
  )

  // Delete the actual accents
  await db.runSql(
    `
      DELETE FROM accents
      WHERE locale_id=?
        AND id IN (${qq})
    `,
    [locale_id, ...accent_ids]
  )
}
