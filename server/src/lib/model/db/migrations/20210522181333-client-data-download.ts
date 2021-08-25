export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
    CREATE TABLE user_client_takeouts (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      client_id CHAR(36) NOT NULL,
      state INT NOT NULL,
      requested_date DATETIME NOT NULL,
      expiration_date DATETIME NULL,
      clip_count INT UNSIGNED NULL,
      clip_total_size INT UNSIGNED NULL,
      archive_count INT UNSIGNED NULL,

      FOREIGN KEY (client_id) REFERENCES user_clients(client_id) ON DELETE CASCADE
    );
    `
  );
};

export const down = function (db: any): Promise<any> {
  return db.runSql(
    `
    DROP TABLE user_client_takeouts;
    `
  );
};
