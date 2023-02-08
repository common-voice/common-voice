export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
  VALUES
    ('Common Voice Corpus 11.0', 'cv-corpus-11.0-2022-09-21', TRUE, '2022-09-07', '2022-09-21')
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function (): Promise<any> {
  return null;
};
