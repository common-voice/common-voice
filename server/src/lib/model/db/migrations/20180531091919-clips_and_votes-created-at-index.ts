export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips ADD INDEX created_at_idx (created_at);
      ALTER TABLE votes ADD INDEX created_at_idx (created_at);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
