export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
  VALUES
    ('Common Voice Corpus 10.0', 'cv-corpus-10.0-2022-07-04', TRUE, '2022-07-04', '2022-07-06')
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function (): Promise<any> {
  return null;
};
