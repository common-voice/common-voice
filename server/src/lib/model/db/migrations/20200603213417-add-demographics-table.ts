export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE demographics (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        age VARCHAR(255) DEFAULT NULL,
        gender VARCHAR(255) DEFAULT NULL,
        updated_at DATETIME DEFAULT now(),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        UNIQUE (client_id, age, gender)
      );

      CREATE TABLE user_client_demographics (
        client_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        demographic_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (demographic_id) REFERENCES demographics (id)
      )

      CREATE TABLE clip_demographics (
        clip_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        demographic_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
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
