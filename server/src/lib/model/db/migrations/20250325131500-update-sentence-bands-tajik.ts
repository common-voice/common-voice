export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 5000
    WHERE name IN ( 'tg') `);
};

export const down = async function (): Promise<any> {
  return null;
};
