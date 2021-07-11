export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
    	VALUES
        ('Common Voice Corpus 6.0', 'cv-corpus-6.0-2020-12-11', TRUE, '2020-12-11', '2020-12-16'),
        ('Common Voice Singleword Segment 6.0', 'cv-corpus-6.0-singleword', FALSE, '2020-12-11', '2020-12-16')
      ON DUPLICATE KEY UPDATE name=name

  `);
};

export const down = function (): Promise<any> {
  return null;
};
