export const up = async function(db: any): Promise<any> {
  await db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
  VALUES
    ('Common Voice Corpus 15.0', 'cv-corpus-15.0-2023-09-08', TRUE, '2023-09-08', '2023-09-14', 103503334891, 68974275000, "complete","cv-corpus-15.0-2023-09-08/cv-corpus-15.0-2023-09-08-{locale}.tar.gz")
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function(db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 15.0' 
  `);
};
