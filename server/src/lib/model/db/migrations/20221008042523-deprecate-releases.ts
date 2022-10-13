export const up = async function (db: any): Promise<any> {
  // await db.runSql(`
  //   ALTER TABLE datasets
  //   ADD COLUMN is_deprecated BOOLEAN DEFAULT 0 NOT NULL
  // `);

  await db.runSql(`
    UPDATE datasets
    SET is_deprecated = 1
    WHERE release_dir in (
      'cv-corpus-2', 
      'cv-corpus-3',
      'cv-corpus-4-2019-12-10',
      'cv-corpus-5-2020-06-22',
      'cv-corpus-5-singleword',
      'cv-corpus-6.0-2020-12-11',
      'cv-corpus-6.0-singleword',
      'cv-corpus-5.1-2020-06-22',
      'cv-corpus-5.1-singleword',
      'cv-corpus-6.1-2020-12-11', 
      'cv-corpus-6.1-singleword',
      'cv-corpus-7.0-2021-07-21',
      'cv-corpus-8.0-2022-01-19',
      'cv-corpus-9.0-2022-04-27'
      )
  `);
};

export const down = function (): Promise<any> {
  return null;
};
