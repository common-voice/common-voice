export const up = async function (db: any): Promise<any> {
  return db.runSql(`ALTER TABLE clips ADD COLUMN duration INT NOT NULL DEFAULT 0`);
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`ALTER TABLE clips DROP COLUMN duration`);
};
