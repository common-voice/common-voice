export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE skipped_clips (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        clip_id BIGINT(20) UNSIGNED NOT NULL,
        client_id CHAR(36) NOT NULL,
        created_at DATETIME DEFAULT now(),
        FOREIGN KEY (clip_id) REFERENCES clips (id),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id)
      );
    `
  );
};
