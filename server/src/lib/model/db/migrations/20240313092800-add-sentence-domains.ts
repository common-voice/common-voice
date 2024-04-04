export const up = async function (db: any): Promise<any> {
  // CREATE NEW DOMAINS TABLE TO STORE CURRENT DOMAIN VALUES
  // AND TRANSFER DATA
  await db.runSql(`
    CREATE TABLE IF NOT EXISTS domains LIKE sentence_domains
  `)

  await db.runSql(`
    INSERT INTO domains(id, domain) SELECT id, domain FROM sentence_domains sd
    ON DUPLICATE KEY UPDATE domain=VALUES(domain)
  `)

  // CREATE NEW SENTENCE DOMAIN TABLE TO MAP SENTENCES WITH DOMAINS
  await db.runSql(`
    CREATE TABLE IF NOT EXISTS sentence_domains_new (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      sentence_id VARCHAR(255) NOT NULL,
      domain_id INT UNSIGNED NOT NULL,
      created_at DATETIME DEFAULT NOW(),
      PRIMARY KEY (id),
      KEY sentence_domain_index (sentence_id, domain_id),
      CONSTRAINT sentence_domains_sentence_id_fk FOREIGN KEY (sentence_id) REFERENCES sentences (id) ON DELETE CASCADE,
      CONSTRAINT sentence_domains_domain_id_fk FOREIGN KEY (domain_id) REFERENCES domains (id) ON DELETE CASCADE
    )
  `)

  // IMPORT CURRENT SENTENCE DOMAIN VALUES
  await db.runSql(`
    INSERT INTO sentence_domains_new (sentence_id, domain_id) 
    SELECT sentence_id, domain_id 
    FROM sentence_metadata 
    WHERE sentence_metadata.domain_id IS NOT NULL
  `)

  // REMOVE domain_id COLUMN FROM sentence_metadata TABLE
  await db.runSql(`
    ALTER TABLE sentence_metadata DROP FOREIGN KEY domain_id_fk
  `)

  await db.runSql(`
    ALTER TABLE sentence_metadata DROP COLUMN domain_id
  `)

  await db.runSql(`
    DROP TABLE sentence_domains
  `)

  await db.runSql(`
    RENAME TABLE sentence_domains_new TO sentence_domains
  `)
}

export const down = async function (db: any): Promise<any> {
  return null
}
