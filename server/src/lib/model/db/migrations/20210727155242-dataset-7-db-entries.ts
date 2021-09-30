export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
    	VALUES
        ('Common Voice Corpus 7.0', 'cv-corpus-7.0-2021-07-21', TRUE, '2021-07-21', '2021-07-28'),
        ('Common Voice Singleword Segment 7.0', 'cv-corpus-7.0-singleword', FALSE, '2021-07-21', '2021-07-28')
      ON DUPLICATE KEY UPDATE name=name

  `);
};

export const down = function (): Promise<any> {
  return null;
};
