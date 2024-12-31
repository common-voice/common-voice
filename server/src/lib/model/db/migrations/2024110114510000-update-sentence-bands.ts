export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('zoc', 'mau', 'var', 'ncx', 'sei', 'yaq', 'cux', 'cut', 'pua', 'gv', 'kw', 'esu', 'sva', 'xmf', 'bbl', 'scl', 'phl', 'oru', 'dml', 'khw', 'kls', 'bft', 'bsk', 'trw', 'xhe', 'hno', 'bgp', 'leu', 'qxp', 'szy', 'an', 'ady', 'kbd')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
