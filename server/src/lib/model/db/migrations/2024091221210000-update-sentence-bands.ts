export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('pcm', 'fub')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
