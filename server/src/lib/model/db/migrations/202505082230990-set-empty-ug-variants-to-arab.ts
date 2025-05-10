export const up = async function (db: any): Promise<any> {
  await db.runSql(`
      INSERT INTO sentence_metadata (sentence_id, variant_id, created_at)
        SELECT 
          s.id,
          v.id,
          NOW()
        FROM 
          sentences s,
          variants v,
          locales l
        WHERE 
          l.name = 'ug'
          AND s.locale_id = l.id
          AND v.variant_token = 'ug-Arab'
    `)
}

export const down = async function (): Promise<any> {
  return null
}
