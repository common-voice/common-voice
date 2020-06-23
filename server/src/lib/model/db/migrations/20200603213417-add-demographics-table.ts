export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE ages (
        id  UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        age VARCHAR(255) DEFAULT NULL
      )

      /* Sex and gender exist across multiple spectra which are not adequately
         represented in our current database schema.

         Including demographic data with our dataset is necessary to ensure its
         utility to researchers, and helps us track the fullness and inclusion
         of our collection process. We will ALWAYS keep this field optional. We
         only store records for users who opt in, and will always (at very
         least) maintain an "Other" option.
      */
      CREATE TABLE sexes (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sex VARCHAR(255) DEFAULT NULL
      )

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
      )

      CREATE TABLE clip_demographics (
        clip_id BIGINT(20) UNSIGNED NOT NULL PRIMARY KEY,
        demographic_id BIGINT(20) UNSIGNED NOT NULL,
        FOREIGN KEY (clip_id) REFERENCES clips (id),
        FOREIGN KEY (demographic_id) REFERENCES demographics (id)
      )

      ALTER TABLE user_clients
        CHANGE COLUMN age deprecated_age VARCHAR(255),
        CHANGE COLUMN gender deprecated_gender VARCHAR(255);
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
