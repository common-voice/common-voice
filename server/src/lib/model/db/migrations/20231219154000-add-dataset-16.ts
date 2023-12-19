export const up = async function(db: any): Promise<any> {
  await db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
  VALUES
    ('Common Voice Corpus 16.0', 'cv-corpus-16.0-2023-12-06', TRUE, '2023-12-06', '2023-12-19', 109183747623, 70824257000, "complete","cv-corpus-16.0-2023-12-06/cv-corpus-16.0-2023-12-06-{locale}.tar.gz")
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function(db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 16.0' 
  `);
};
