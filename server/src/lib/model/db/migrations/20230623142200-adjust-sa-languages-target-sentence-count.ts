export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 2000
    WHERE name IN ('af','nso','st')
  `);

  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('nr','ss','tn','ts','ve','xh','zu')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
