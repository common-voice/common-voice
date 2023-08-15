export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    UPDATE sentences SET is_used = FALSE
    WHERE text REGEXP '.*\\\\?[a-z].*' OR text = ''
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
