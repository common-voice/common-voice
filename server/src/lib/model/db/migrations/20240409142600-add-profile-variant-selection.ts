export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE user_client_variants
    ADD is_preferred_option TINYINT NOT NULL DEFAULT FALSE
    AFTER variant_id
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(
    `ALTER TABLE user_client_variants DROP COLUMN is_preferred_option`
  )
}
