export const up = async function(db: any): Promise<any> {
  await db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
  VALUES
    ('Common Voice Corpus 13.0', 'cv-corpus-13.0-2023-03-09', TRUE, '2023-03-09', '2023-03-15', 97709611853, 63681475000, "complete","cv-corpus-13.0-2023-03-09/cv-corpus-13.0-2023-03-09-{locale}.tar.gz")
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function(): Promise<any> {
  return null;
};
