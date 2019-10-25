export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    /* Keep user_clients clean */
    ALTER TABLE user_clients DROP FOREIGN KEY uc_ibfk_1, DROP COLUMN challenge_team;

    /* A list of challenges. This will only hold one row (the pilot challenge) until at least 2020. */
    CREATE TABLE challenges (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      name VARCHAR(255),
      url_token VARCHAR(36) NOT NULL,
      start_date DATETIME NOT NULL
    );

    ALTER TABLE teams DROP PRIMARY KEY,
              ADD COLUMN id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, /* better performance and shorter sql statements */
              CHANGE invite_token url_token VARCHAR(36) NOT NULL,
              CHANGE team_name name VARCHAR(255),
              ADD COLUMN challenge_id INT UNSIGNED NOT NULL,                  /* teams has to be associated with exact one challenge to make sense */
              ADD FOREIGN KEY (challenge_id) REFERENCES challenges(id);

    /* Records each enrollment (a user signing up for a team) across all challenges. */
    CREATE TABLE enrollments (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      client_id CHAR(36) NOT NULL,
      team_id INT UNSIGNED NOT NULL,        /* enroll means user becomes a team member of one challenge */
      challenge_id INT UNSIGNED NOT NULL,
      url_token CHAR(12) NOT NULL,
      invited_by CHAR(12),
      enrolled_at DATETIME DEFAULT now(),
      seen_welcome_modal BOOLEAN DEFAULT FALSE,

      UNIQUE (url_token),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (challenge_id) REFERENCES challenges(id),
      FOREIGN KEY (invited_by) REFERENCES enrollments(url_token)
    );



    /* A list of achievements that can be won across all challenges. */
    CREATE TABLE achievements (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      challenge_id INT UNSIGNED NOT NULL,                     /* only challenges could have achievements */
      name VARCHAR(255),
      points INT NOT NULL,
      image_url VARCHAR,

      FOREIGN KEY (challenge_id) REFERENCES challenges(id)
    );


    /* Records the time and type whenever a team OR user earns an achievement. */
    /* client_id and team_id are mutually exclusive */
    CREATE TABLE earn (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      achievement_id INT UNSIGNED NOT NULL,
      client_id CHAR(36), /* Must be one or the other. */
      team_id INT UNSIGNED, /* Must be one or the other. */
      earned_at DATETIME DEFAULT now(),

      FOREIGN KEY (achievement_id) REFERENCES achievements(id),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
