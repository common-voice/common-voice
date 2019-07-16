export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE streaks (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        locale_id INT NOT NULL,
        started_at DATETIME,
        last_activity_at DATETIME,
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE,
        FOREIGN KEY (locale_id) REFERENCES locales (id) ON DELETE CASCADE,
        UNIQUE KEY (client_id, locale_id)
      );

      CREATE TABLE reached_goals (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        type ENUM('streak', 'clips', 'votes') NOT NULL,
        count SMALLINT UNSIGNED NOT NULL,
        client_id CHAR(36) NOT NULL,
        locale_id INT NOT NULL,
        reached_at DATETIME NOT NULL,
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (locale_id) REFERENCES locales (id),
        UNIQUE(count, type, client_id, locale_id)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
