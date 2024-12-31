export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE datasets
    SET total_clips_duration = 115639805731, valid_clips_duration = 75397609000
    WHERE name = 'Common Voice Corpus 18.0'
  `)
}

export const down = async function (db: any): Promise<any> {
  return null
}
