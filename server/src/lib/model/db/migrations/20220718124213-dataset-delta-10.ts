export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration,	valid_clips_duration,	release_type)
  VALUES
    ('Common Voice Delta Segment 10.0', 'cv-corpus-10.0-delta-2022-07-04', TRUE, '2022-07-04', '2022-07-20', 2159111903, 936568000, 'delta')
  ON DUPLICATE KEY UPDATE name=name
  `);
};

export const down = function (): Promise<any> {
  return null;
};
