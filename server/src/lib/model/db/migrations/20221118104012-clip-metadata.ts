export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    CREATE TABLE clips_metadata (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      clip_id BIGINT(20) UNSIGNED NOT NULL,
      duration INT UNSIGNED,
      FOREIGN KEY (clip_id) REFERENCES clips(id) ON DELETE CASCADE
    )
    `
  );
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql(`DROP TABLE clips_metadata`);
};
