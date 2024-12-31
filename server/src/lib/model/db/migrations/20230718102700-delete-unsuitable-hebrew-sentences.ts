export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM sentences WHERE source = 'The Westminster Leningrad Codex' AND locale_id = (SELECT id FROM locales WHERE name = 'he')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
