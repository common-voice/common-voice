export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE custom_goals
        DROP INDEX client_id,
        ADD INDEX client_id_idx(client_id);

      CREATE TABLE awards (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        custom_goal_id INT UNSIGNED NOT NULL,
        goal_interval_start TIMESTAMP NOT NULL,
        created_at DATETIME DEFAULT now(),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (custom_goal_id) REFERENCES custom_goals (id)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
