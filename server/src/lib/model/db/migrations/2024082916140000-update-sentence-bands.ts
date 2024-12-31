export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('bba', 'ksf', 'bfd', 'bax', 'beb', 'abb', 'bci', 'bnm', 'fue', 'bum', 'wes', 'dua', 'ebr', 'eto', 'fan', 'gya', 'bbj', 'ibb', 'bkm', 'mxu', 'mbo', 'bri', 'nnh', 'teg', 'tvu', 'tui')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
