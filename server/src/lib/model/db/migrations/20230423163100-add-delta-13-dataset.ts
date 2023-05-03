export const up = async function (db: any): Promise<any> {
  await db.runSql(`
  INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type, download_path)
  VALUES
    ('Common Voice Delta Segment 13.0', 'cv-corpus-13.0-delta-2023-03-09', TRUE, '2023-03-09', '2023-04-24', 3681211853, 2024597000, 'delta','cv-corpus-13.0-delta-2023-03-09/cv-corpus-13.0-delta-2023-03-09-{locale}.tar.gz')
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function (): Promise<any> {
  return null;
};
