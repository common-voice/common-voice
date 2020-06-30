export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE ages (
        id  UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        age VARCHAR(255) DEFAULT NULL
      );

      CREATE TABLE sexes (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sex VARCHAR(255) DEFAULT NULL
      );

      CREATE TABLE demographics (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        age_id BIGINT(20),
        sex_id BIGINT(20),
        updated_at DATETIME DEFAULT now(),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (age_id) REFERENCES ages (id),
        FOREIGN KEY (sex_id) REFERENCES sexes (id),
        UNIQUE (client_id, age_id, sex_id)
      );

      CREATE TABLE user_client_demographics (
        client_id CHAR(36) NOT NULL PRIMARY KEY,
        demographic_id BIGINT(20) UNSIGNED NOT NULL,
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (demographic_id) REFERENCES demographics (id)
      );

      CREATE TABLE clip_demographics (
        clip_id BIGINT(20) UNSIGNED NOT NULL PRIMARY KEY,
        demographic_id BIGINT(20) UNSIGNED NOT NULL,
        FOREIGN KEY (clip_id) REFERENCES clips (id),
        FOREIGN KEY (demographic_id) REFERENCES demographics (id)
      );

      ALTER TABLE user_clients
        CHANGE COLUMN age deprecated_age VARCHAR(255),
        CHANGE COLUMN gender deprecated_gender VARCHAR(255);

      INSERT INTO ages (age) VALUES (
        'teens',
        'twenties',
        'thirties',
        'fourties',
        'fifties',
        'sixties',
        'seventies',
        'eighties',
        'nineties'
      );

      /* Sex and gender exist across multiple spectra which are not adequately
         represented in our current database schema.

         Including demographic data with our dataset is necessary to ensure its
         utility to researchers, and helps us track the fullness and inclusion
         of our collection process. We will ALWAYS keep this field optional. We
         only store records for users who opt in, and will always (at very
         least) maintain an "Other" option.
      */
      INSERT INTO sexes (sex) VALUES ('female', 'male', 'other');

      /* FIXME: Only insert records with non-null demographics. */
      INSERT INTO demographics (client_id, age, sex)  (
        SELECT user_clients.client_id, ages.id, sexes.id
        FROM user_clients
        INNER JOIN ages ON ages.age = user_clients.deprecated_age
        INNER JOIN sexes ON sexes.sex = user_clients.deprecated_gender
      );

      INSERT INTO user_client_demographics (client_id, demographic_id)  (
        SELECT user_clients.client_id, demographics.id AS demographic_id
        FROM user_clients
        INNER JOIN demographics ON user_clients.client_id = demographics.client_id
      );

      INSERT INTO clip_demographics (clip_id, demographic_id)  (
        SELECT clips.id AS clip_id, demographics.id AS demographic_id
        FROM clips
        INNER JOIN demographics ON clips.client_id = demographics.client_id
      );
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
