export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
    	VALUES
        ('Common Voice Corpus 6.1', 'cv-corpus-6.1-2020-12-11', TRUE, '2020-12-11', '2020-12-22'),
        ('Common Voice Singleword Segment 6.1', 'cv-corpus-6.1-singleword', FALSE, '2020-12-11', '2020-12-22')
      ON DUPLICATE KEY UPDATE name=name

  `);
};

export const down = function (): Promise<any> {
  return null;
};
