export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE locales
    ADD english_name VARCHAR(255) DEFAULT NULL
    AFTER target_sentence_count
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`ALTER TABLE locales DROP COLUMN english_name`)
}
