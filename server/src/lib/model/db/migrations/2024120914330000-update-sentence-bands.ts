export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE locales SET target_sentence_count = 750
    WHERE name IN ('ukv','trv','top','tob','tbo','tay','sco','ruc','qxw','qxu','qxt','qxa','qws','qwa','qvl','qva','qux','qup','pwn','mmc','meh','lth','lke','kcn','jqr','ipk','ikx','hch','hac','glv','dru','kw','bnn','bew','arg','aln','aat')
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
