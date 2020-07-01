export const up = async function (db: any): Promise<any> {
  // Note: Manual backfill to follow.
  return db.runSql(`
    ALTER TABLE sentences
    	ADD COLUMN has_valid_clip BOOLEAN DEFAULT FALSE,
    	ADD INDEX (has_valid_clip);
  `);
};

export const down = function (): Promise<any> {
  return null;
};
