export const up = async function(db: any): Promise<any> {
  await db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
  VALUES
    ('Common Voice Corpus 14.0', 'cv-corpus-14.0-2023-06-23', TRUE, '2023-06-23', '2023-06-28', 101224789375, 67144231000, "complete","cv-corpus-14.0-2023-06-23/cv-corpus-14.0-2023-06-23-{locale}.tar.gz")
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function(db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 14.0' 
  `);
};
