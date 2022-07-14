export const up = async function (db: any): Promise<any> {
  // add total stats to datasets
  // await db.runSql(`
  //   ALTER TABLE datasets
  //     ADD COLUMN total_clips_duration BIGINT UNSIGNED,
  //     ADD COLUMN valid_clips_duration BIGINT UNSIGNED,
  //     ADD COLUMN release_type ENUM ('complete', 'singleword', 'delta') DEFAULT 'complete'
  //   `);

  await db.runSql(`
    CREATE TABLE locale_datasets (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      dataset_id INT UNSIGNED NOT NULL,
      locale_id INT(11) NOT NULL,
      total_clips_duration BIGINT UNSIGNED,
      valid_clips_duration BIGINT UNSIGNED, 
      average_clips_duration INT UNSIGNED,
      total_users BIGINT UNSIGNED,
      size BIGINT UNSIGNED,
      checksum VARCHAR(255),
      FOREIGN KEY (dataset_id) REFERENCES datasets(id), 
      FOREIGN KEY (locale_id) REFERENCES locales(id)
    )
  `);
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql(`
  ALTER TABLE datasets 
    DROP COLUMN total_clips_duration, 
    DROP COLUMN valid_clips_duration,
    DROP COLUMN release_type
`);
};
