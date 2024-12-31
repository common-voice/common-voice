export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE sentence_metadata ADD COLUMN bulk_submission_id INT UNSIGNED DEFAULT NULL AFTER sentence_id
  `);

  await db.runSql(`  
    ALTER TABLE sentence_metadata ADD CONSTRAINT fk_bulk_submission_id FOREIGN KEY (bulk_submission_id) REFERENCES bulk_submissions(id)
  `);

  return null;
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE sentence_metadata DROP CONSTRAINT fk_bulk_submission_id
  `);

  await db.runSql(`
    ALTER TABLE sentence_metadata DROP COLUMN bulk_submission_id
  `);

  return null;
};
