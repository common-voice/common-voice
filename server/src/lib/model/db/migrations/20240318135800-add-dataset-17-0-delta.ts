export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path)
    VALUES
      ('Common Voice Delta Segment 17.0', 'cv-corpus-17.0-delta-2024-03-15', TRUE, '2024-03-15', '2024-03-20', 3047441256, 1775485000, 'delta', 'cv-corpus-17.0-delta-2024-03-15/cv-corpus-17.0-delta-2024-03-15-{locale}.tar.gz')
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Delta Segment 17.0'
  `)
}
