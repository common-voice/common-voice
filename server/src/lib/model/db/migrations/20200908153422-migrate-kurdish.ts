export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    UPDATE locales
    SET name = "ckb"
    WHERE name = "ku"
    LIMIT 1
  `);
};

export const down = function (): Promise<any> {
  return null;
};
