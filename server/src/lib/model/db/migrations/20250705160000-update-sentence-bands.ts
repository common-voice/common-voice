/*
This migration sets sentence bands after a detailed analysis.
- Compared Pontoon locale data with MCV locales, checking population values
- Already is_contributable locales are left out
- Bands could be set to a lower level for any reason, these are also left out
- Thus this migration only sets locales (mostly new additions) to a lower band
*/
export const up = async function (db: any): Promise<any> {
  // BAND A (750 sentences - <1M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 750
      WHERE name IN (
          'dar', 'fo', 'gos', 'hyw', 'iba', 'ie', 'jbo', 'kaa', 'kcn', 'krc',
          'lb', 'led', 'lld', 'lrl', 'mqh', 'mrh', 'pap', 'ruc', 'ukv'
        )
    `
  )
  // BAND B (2000 sentences - 1-10M speakers)
  await db.runSql(
    `
      UPDATE locales SET target_sentence_count = 2000
      WHERE name IN ( 
        'aa', 'bal', 'bo', 'brx', 'bs', 'din', 'ee', 'hil', 'hr', 'hrx', 'jam', 'kam', 'ks',
        'lke', 'ln', 'lth', 'nd', 'new', 'nqo', 'rif', 'sdh', 'shn', 'snk', 'wo'
      )
    `
  )
}

export const down = async function (): Promise<any> {
  return null
}
