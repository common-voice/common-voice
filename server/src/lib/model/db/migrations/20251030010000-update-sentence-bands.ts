export const up = async function (db: any): Promise<any> {
  // BAND A (750 sentences - <1M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 750
      WHERE name IN (
        'abq', 'bsy', 'gaa', 'kzi', 'mbf', 'mel', 'mfe',
        'pau', 'pcd', 'pez', 'pne', 'qxq', 'sdo', 'snv',
        'xdq', 'xkl', 'xsm'
        )
    `
  )
  // BAND B (2000 sentences - 1-10M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 2000
      WHERE name IN ( 
        'cpx', 'glk', 'msi', 'seh'
      )
    `
  )
}

export const down = async function (): Promise<any> {
  return null
}
