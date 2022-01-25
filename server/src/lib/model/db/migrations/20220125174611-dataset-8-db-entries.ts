export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
  VALUES
    ('Common Voice Corpus 8.0', 'cv-corpus-8.0-2022-01-19', TRUE, '2022-01-19', '2022-01-26')
  `);
};

export const down = function (): Promise<any> {
  return null;
};
