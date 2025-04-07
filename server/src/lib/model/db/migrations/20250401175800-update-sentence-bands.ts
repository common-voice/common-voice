export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ( 'mki', 'gig', 'ggg', 'gjk', 'mve', 'odk', 'kvx', 'kxp', 'phr', 'ydg', 'sbn', 
    'lrk', 'btv', 'ssi', 'tar', 'tli', 'yav', 'gid', 'udl', 'bag', 'mgg', 'mcn', 'mcx', 'bkh', 
    'nla', 'giz', 'jgo', 'fmp', 'mua', 'mug', 'mhk', 'mse', 'mdd', 'ajg', 'kdh', 'gej', 'nmz', 
    'prq', 'cpy', 'qug', 'qus', 'qur', 'mcf', 'hux', 'ttj', 'koo', 'rwm', 'bxk', 'cgg', 'lua', 
    'hem', 'cjk', 'rof') `);

  await db.runSql(`
    UPDATE locales SET target_sentence_count = 5000
    WHERE name IN ( 'tg') `);
};

export const down = async function (): Promise<any> {
  return null;
};
