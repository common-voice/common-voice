export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE datasets SET is_deprecated = TRUE WHERE name = 'Common Voice Corpus 16.0'
  `)

  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 16.1', 'cv-corpus-16.1-2023-12-06', TRUE, '2023-12-06', '2024-01-05', 109183755259, 71695462000, "complete", "cv-corpus-16.1-2023-12-06/cv-corpus-16.1-2023-12-06-{locale}.tar.gz")
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE datasets SET is_deprecated = FALSE WHERE name = 'Common Voice Corpus 16.0'
  `)

  await db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Corpus 16.1' 
  `)
}
