/* eslint-disable @typescript-eslint/no-explicit-any */
export const up = async function (db: any): Promise<any> {
  // BAND A (750 sentences - <1M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 750
      WHERE name IN (
        'aii', 'efk', 'laj', 'tum'
        )
    `
  )
}

export const down = async function (): Promise<any> {
  return null
}
