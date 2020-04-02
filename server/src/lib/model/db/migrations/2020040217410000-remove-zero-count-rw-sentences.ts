export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      DELETE FROM sentences WHERE locale_id = (SELECT id FROM locales where name = "rw") AND clips_count = 0;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
