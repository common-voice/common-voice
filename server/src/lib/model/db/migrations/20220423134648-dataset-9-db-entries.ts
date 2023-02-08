export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
  VALUES
    ('Common Voice Corpus 9.0', 'cv-corpus-9.0-2022-01-19', TRUE, '2022-04-07', '2022-04-27')
  `);
};

export const down = function (): Promise<any> {
  return null;
};
