export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      UPDATE sentences SET clips_count = 1 WHERE locale_id = (SELECT id FROM locales where name = "rw") AND clips_count = 0;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
