// DO NOT REUSE THIS!
// This migration removes an erronously defined locale with all dependencies
// This kind of process needs careful examination of live data due to referential integrity
// Western Armenian (hyw) is considered a variant of Armenian
// It only has some references in user accent data

const LOCALE_CODE = 'hyw'

//
// Do not change the code below
//
export const up = async function (db: any): Promise<any> {
  // Find locale id
  const [result] = await db.runSql(
    `SELECT id as locale_id FROM locales WHERE name = ?`,
    [LOCALE_CODE]
  )
  const locale_id = result?.locale_id
  if (!locale_id) {
    console.warn(`Specified locale does not exist: [${LOCALE_CODE}]`)
    return
  }

  // Remove references from bottom to top
  await db.runSql(`DELETE FROM user_client_accents WHERE locale_id = ? `,
    [locale_id]
  )
  await db.runSql(`DELETE FROM accents WHERE locale_id = ? `,
    [locale_id]
  )
  await db.runSql(`DELETE FROM locales WHERE name = ? `,
    [LOCALE_CODE]
  )
}

export const down = async function (): Promise<unknown> {
  // we can not take these changes back
  return null
}
