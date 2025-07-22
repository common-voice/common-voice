// Template to retire sentences from a specific source
// Does not delete, but disables for further recordings

const LOCALE = 'ca'
const SOURCE = 'frases_agenda'

//
// Do not change the code below unless database structure has been changed
//
// do it in small batches not to lock the users much or trigger autoscale
// it will take longer but uses less resources
const BATCH_SIZE = 10000
export const up = async function (db: any): Promise<any> {
  // Find locale id
  const [result] = await db.runSql(
    `SELECT id as locale_id FROM locales WHERE name = ?`,
    [LOCALE]
  )
  const locale_id = result?.locale_id
  if (!locale_id) {
    // for local env do not throw/fail but continue with next
    console.warn(`Specified locale does not exist: [${LOCALE}]`)
    return
  }

  // do it in small batches
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { affectedRows } = await db.runSql(
      `
      UPDATE sentences
      SET is_used = FALSE
      WHERE locale_id = ?
        AND source = ?
        AND is_used = TRUE
      ORDER BY id
      LIMIT ?
      `,
      [locale_id, SOURCE, BATCH_SIZE]
    )
    if (affectedRows < BATCH_SIZE) break
  }
}

export const down = async function (db: any): Promise<any> {
  // Find locale id
  const [result] = await db.runSql(
    `SELECT id as locale_id FROM locales WHERE name = ?`,
    [LOCALE]
  )
  const locale_id = result?.locale_id
  if (!locale_id) {
    throw new Error(`Specified locale does not exist: [${LOCALE}]`)
  }

  // do it in small batches
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { affectedRows } = await db.runSql(
      `
      UPDATE sentences
      SET is_used = TRUE
      WHERE locale_id = ?
        AND source = ?
        AND is_used = FALSE
      ORDER BY id
      LIMIT ?
      `,
      [locale_id, SOURCE, BATCH_SIZE]
    )
    if (affectedRows < BATCH_SIZE) break
  }
}
