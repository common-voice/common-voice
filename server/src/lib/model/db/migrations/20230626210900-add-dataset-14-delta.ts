export const up = async function (db: any): Promise<any> {
  await db.runSql(`
  INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path)
  VALUES
    ('Common Voice Delta Segment 14.0', 'cv-corpus-14.0-delta-2023-06-23', TRUE, '2023-06-23', '2023-06-28', 3515177522, 3462756000, 'delta','cv-corpus-14.0-delta-2023-06-23/cv-corpus-14.0-delta-2023-06-23-{locale}.tar.gz')
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function(db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM datasets WHERE name = 'Common Voice Delta Segment 14.0' 
  `);
};
