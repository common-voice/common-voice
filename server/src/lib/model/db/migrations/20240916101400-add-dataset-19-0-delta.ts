export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path)
    VALUES
      ('Common Voice Delta Segment 19.0', 'cv-corpus-19.0-delta-2024-09-13', TRUE, '2024-09-13', '2024-09-18', 1665436644, 2338259000, 'delta', 'cv-corpus-19.0-delta-2024-09-13/cv-corpus-19.0-delta-2024-09-13-{locale}.tar.gz')
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Delta Segment 19.0'
  `)
}
