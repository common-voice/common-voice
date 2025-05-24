export const up = async function (db: any): Promise<any> {
  const LOCALE = 'tvu'
  const MOVE_TO_VARIANT = 'tvu-ndikini'
  await db.runSql(
    `
      UPDATE sentence_metadata sm
      JOIN sentences s on s.id = sm.sentence_id
      SET sm.variant_id= (SELECT id FROM variants WHERE variant_token = ?)
      WHERE locale_id = (SELECT id FROM locales WHERE name = ?)
        AND variant_id IS NULL
    `,
    [MOVE_TO_VARIANT, LOCALE]
  )
}

export const down = async function (): Promise<any> {
  return null
}
