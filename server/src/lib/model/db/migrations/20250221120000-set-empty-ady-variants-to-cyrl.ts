export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE sentence_metadata sm
    JOIN sentences s on s.id = sm.sentence_id
    SET sm.variant_id= (SELECT id FROM variants WHERE variant_token = 'ady-Cyrl')
    WHERE locale_id = (SELECT id FROM locales WHERE name='ady')
      AND variant_id IS NULL
  `)
}

export const down = async function (): Promise<any> {
  return null
}
