export const up = async function(db: any): Promise<any> {
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 17.0', 'cv-corpus-17.0-2024-03-15', TRUE, '2024-03-15', '2024-03-20', 112231196515, 73470947000, "complete", "cv-corpus-17.0-2024-03-15/cv-corpus-17.0-2024-03-15-{locale}.tar.gz")
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function(db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 17.0' 
  `)
}
