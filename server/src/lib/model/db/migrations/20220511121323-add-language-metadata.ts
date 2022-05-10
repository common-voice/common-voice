export const up = async function (db: any): Promise<any> {
  console.log('this is to be run');
  //   const getLanguagesQuery = await db.runSql(`
  //     SELECT l.id, l.name, l.target_sentence_count as target_sentence_count, count(1) as total_sentence_count
  //     FROM locales l
  //     JOIN sentences s ON s.locale_id = l.id
  //     GROUP BY l.id
  //     `);
  //   const getLanguages = getLanguagesQuery.reduce((obj: any, row: any) => {
  //     obj[row.name] = {
  //       id: row.id,
  //       name: row.name,
  //       isContributable: row.total_sentence_count >= row.target_sentence_count,
  //     };
  //     return obj;
  //   }, {});
  //   console.log(getLanguages);
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql(`
  `);
};
