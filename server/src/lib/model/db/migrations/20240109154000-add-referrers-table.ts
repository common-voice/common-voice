export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    CREATE TABLE referrers (
      id int unsigned NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY name_idx (name)
    )
  `)

  await db.runSql(`
    INSERT INTO referrers (name) VALUES ('Hugging Face')
  `)

  await db.runSql(`  
    INSERT INTO locales (name, native_name) VALUES ('unknown', 'unknown')
  `)

  await db.runSql(`
    ALTER TABLE downloaders
    ADD COLUMN referrer_id INT UNSIGNED DEFAULT NULL,
    ADD CONSTRAINT fk_referrer_id FOREIGN KEY (referrer_id) REFERENCES referrers(id)
  `)

  return null
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE downloaders DROP CONSTRAINT fk_referrer_id
  `)

  await db.runSql(`
    ALTER TABLE downloaders DROP COLUMN referrer_id
  `)

  await db.runSql(`
    DROP TABLE referrers
  `)

  await db.runSql(`
    DELETE FROM accents WHERE locale_id = (SELECT id from locales WHERE name = 'unknown')
  `)

  await db.runSql(`
    DELETE FROM locales WHERE name = 'unknown' AND native_name = 'unknown' LIMIT 1
  `)

  return null
}
