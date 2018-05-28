export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE sentences ADD INDEX text_idx (text(300));
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
