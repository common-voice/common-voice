export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips ADD INDEX sentence_idx (sentence(300));
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
