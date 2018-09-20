export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips
        ADD COLUMN needs_votes BOOLEAN DEFAULT TRUE,
        ADD INDEX needs_votes_idx (needs_votes);
      
      ALTER TABLE sentences
        ADD COLUMN clips_count INT DEFAULT 0,
        ADD INDEX clips_count_idx (clips_count);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
