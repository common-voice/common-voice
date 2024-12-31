export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE sentence_metadata
    ADD COLUMN domain_id INT UNSIGNED DEFAULT NULL AFTER client_id,
    ADD CONSTRAINT domain_id_fk FOREIGN KEY (domain_id) REFERENCES sentence_domains(id) ON DELETE SET NULL
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE sentence_metadata
    DROP CONSTRAINT domain_id_fk
  `)

  await db.runSql(`
    ALTER TABLE sentence_metadata
    DROP COLUMN domain_id
  `)
}
