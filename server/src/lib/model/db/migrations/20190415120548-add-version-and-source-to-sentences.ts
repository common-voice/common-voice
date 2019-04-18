export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE sentences
        ADD COLUMN version TINYINT UNSIGNED NOT NULL DEFAULT 0,
        ADD COLUMN source TEXT NULL DEFAULT NULL;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
