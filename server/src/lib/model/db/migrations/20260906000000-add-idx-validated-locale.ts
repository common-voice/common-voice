/* eslint-disable @typescript-eslint/no-explicit-any */
//
// 1888 - Index the sentence review filter: WHERE is_validated = ? AND locale_id = ?
// Online (INPLACE/LOCK=NONE), ~10-20 min on 26.6M rows
//
export const up = async function (db: any): Promise<any> {
  // Sampled statistics are far off (is_validated reports 118 distinct for two
  // values), so raise the sample before building or the index is costed wrongly.
  await db.runSql(`
    ALTER TABLE sentences STATS_SAMPLE_PAGES = 200, ALGORITHM=INPLACE, LOCK=NONE
  `)

  console.log('Building idx_validated_locale - online, expect 10-20 minutes...')
  const startedAt = Date.now()
  await db.runSql(`
    ALTER TABLE sentences
      ADD INDEX idx_validated_locale (is_validated, locale_id),
      ALGORITHM=INPLACE, LOCK=NONE
  `)
  console.log(`Built in ${Math.round((Date.now() - startedAt) / 1000)}s`)

  await db.runSql(`ANALYZE TABLE sentences`)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`ALTER TABLE sentences DROP INDEX idx_validated_locale`)
  await db.runSql(`ALTER TABLE sentences STATS_SAMPLE_PAGES = DEFAULT`)
  await db.runSql(`ANALYZE TABLE sentences`)
}
