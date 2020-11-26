export const up = async function (db: any): Promise<any> {
  // Note: Manual backfill to follow.
  return db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
    	VALUES
        ('Common Voice Corpus 5.1', 'cv-corpus-5.1-2020-06-22', TRUE, '2020-06-22', '2020-07-13'),
        ('Common Voice Singleword Segment 5.1', 'cv-corpus-5.1-singleword', FALSE, '2020-06-22', '2020-09-16')

  `);
};

export const down = function (): Promise<any> {
  return null;
};
