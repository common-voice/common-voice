export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
    ALTER TABLE sentences ADD INDEX source_idx (source(50));
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
