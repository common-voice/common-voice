export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 22.0', 'cv-corpus-22.0-2025-06-20', TRUE, '2025-06-20', '2025-06-25', 121737597979, 81507729000, 'complete', 'cv-corpus-22.0-2025-06-20/cv-corpus-22.0-2025-06-20-{locale}.tar.gz'),
      ('Common Voice Delta Segment 22.0', 'cv-corpus-22.0-delta-2025-06-20', TRUE, '2025-06-20', '2025-06-25', 1012332132, 1068279000, 'delta', 'cv-corpus-22.0-delta-2025-06-20/cv-corpus-22.0-delta-2025-06-20-{locale}.tar.gz')
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name IN ('Common Voice Corpus 22.0', 'Common Voice Delta Segment 22.0')
  `)
}
