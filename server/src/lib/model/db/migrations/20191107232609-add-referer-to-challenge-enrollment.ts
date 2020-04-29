export const up = async function (db: any): Promise<any> {
  return db.runSql(`ALTER TABLE enroll ADD COLUMN referer VARCHAR(255);`);
};

export const down = function (): Promise<any> {
  return null;
};
