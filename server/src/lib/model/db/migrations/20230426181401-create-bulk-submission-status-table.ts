export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    CREATE TABLE IF NOT EXISTS bulk_submission_status (
      id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
      status VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE (status)
    )`);

  await db.runSql(`  
    INSERT IGNORE INTO
      bulk_submission_status (status)
    VALUES  ('new'),
            ('open'),
            ('pending'),
            ('rejected'),
            ('sent_to_legal'),
            ('pending_linguistic_review'),
            ('approved');
  `);

  return null;
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`
    DROP TABLE bulk_submission_status
  `);
};
