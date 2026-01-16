export const up = async function (db: any): Promise<any> {
  // BAND A (750 sentences - <1M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 750
      WHERE name IN (
        'aii', 'efk'
        )
    `
  )
  // BAND B (2000 sentences - 1-10M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 2000
      WHERE name IN ( 
        'laj', 'tum'
      )
    `
  )
}

export const down = async function (): Promise<any> {
  return null
}
