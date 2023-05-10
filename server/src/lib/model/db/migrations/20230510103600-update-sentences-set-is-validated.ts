export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    UPDATE sentences SET is_validated = TRUE WHERE is_validated = FALSE
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
