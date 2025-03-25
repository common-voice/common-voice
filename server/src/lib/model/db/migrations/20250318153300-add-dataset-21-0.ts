export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 21.0', 'cv-corpus-21.0-2025-03-14', TRUE, '2025-03-14', '2025-03-19', 120725265847, 80439450000, 'complete', 'cv-corpus-21.0-2025-03-14/cv-corpus-21.0-2025-03-14-{locale}.tar.gz'),
      ('Common Voice Delta Segment 21.0', 'cv-corpus-21.0-delta-2025-03-14', TRUE, '2025-03-14', '2025-03-19', 1887175728, 1315574000, 'delta', 'cv-corpus-21.0-delta-2025-03-14/cv-corpus-21.0-delta-2025-03-14-{locale}.tar.gz')
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name IN ('Common Voice Corpus 21.0', 'Common Voice Delta Segment 21.0')
  `)
}
