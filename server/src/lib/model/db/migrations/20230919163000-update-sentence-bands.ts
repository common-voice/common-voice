export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('nhi', 'os', 'lzz', 'bm', 'tyv', 'ewo', 'byv')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
