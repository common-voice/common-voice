export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE datasets
    SET total_clips_duration = 3408609216, valid_clips_duration = 1926662000
    WHERE name = 'Common Voice Delta Segment 18.0'
  `)
}

export const down = async function (db: any): Promise<any> {
  return null
}
