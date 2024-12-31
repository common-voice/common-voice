export const up = async function(db: any): Promise<any> {
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 18.0', 'cv-corpus-18.0-2024-06-14', TRUE, '2024-06-14', '2024-06-19', 114630443059, 74841410000, "complete", "cv-corpus-18.0-2024-06-14/cv-corpus-18.0-2024-06-14-{locale}.tar.gz")
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function(db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 18.0'
  `)
}
