export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE sentence_metadata
      ADD COLUMN variant_id INT UNSIGNED DEFAULT NULL AFTER client_id,
      ADD CONSTRAINT sentence_metadata_variant_id_fk FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE SET NULL
    `
  )
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(
    `ALTER TABLE sentence_metadata DROP FOREIGN KEY sentence_metadata_variant_id_fk`
  )

  await db.runSql(`ALTER TABLE sentence_metadata DROP COLUMN variant_id`)

  return null
}
