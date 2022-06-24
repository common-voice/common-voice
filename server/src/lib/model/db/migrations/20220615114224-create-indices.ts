export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    ALTER TABLE sentences 
      ADD INDEX (is_used, locale_id);
    `
  );
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql();
};
