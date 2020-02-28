export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    CREATE TABLE user_client_newsletter_prefs (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      client_id CHAR(36) NOT NULL,
      email VARCHAR(255) NOT NULL,
      basket_token CHAR(36) NOT NULL,
      first_contrib DATETIME,
      goal_created DATETIME,
      goal_reached DATETIME,
      two_day_streak BOOLEAN DEFAULT FALSE,
      last_active DATETIME,
      
      UNIQUE (client_id),
      UNIQUE (basket_token),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id) ON DELETE CASCADE
    );

    INSERT INTO user_client_newsletter_prefs (client_id, email, basket_token)
    SELECT u.client_id, u.email, u.basket_token FROM user_clients u
    WHERE u.basket_token IS NOT NULL AND u.email IS NOT NULL
    ON DUPLICATE KEY UPDATE user_client_newsletter_prefs.basket_token = user_client_newsletter_prefs.basket_token;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
