export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips ADD COLUMN is_valid BOOLEAN;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
