export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips ADD INDEX is_valid_idx (is_valid);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
