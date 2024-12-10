export const up = async function(db: any): Promise<any> {
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path )
    VALUES
      ('Common Voice Corpus 20.0', 'cv-corpus-20.0-2024-12-06', TRUE, '2024-12-06', '2024-12-11', 119342569260, 79589425000, 'complete', 'cv-corpus-20.0-2024-12-06/cv-corpus-20.0-2024-12-06-{locale}.tar.gz'),
      ('Common Voice Delta Segment 20.0', 'cv-corpus-20.0-delta-2024-12-06', TRUE, '2024-12-06', '2024-12-11', 2037326885, 1853557000, 'delta', 'cv-corpus-20.0-delta-2024-12-06/cv-corpus-20.0-delta-2024-12-06-{locale}.tar.gz')
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function(db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name IN ('Common Voice Corpus 20.0', 'Common Voice Delta Segment 20.0')
  `)
}
