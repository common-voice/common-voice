export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE custom_goals (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        type ENUM('speak', 'listen', 'both') NOT NULL,
        days_interval TINYINT UNSIGNED NOT NULL,
        amount SMALLINT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT now(),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        UNIQUE (client_id)
      );
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
