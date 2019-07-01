export const up = async function(db: any): Promise<any> {
  const [row] = await db.runSql("SHOW TABLES LIKE 'version';");
  // If the version table exists, the user already has all the tables below
  return db.runSql(
    row
      ? 'DROP TABLE version'
      : `
      CREATE TABLE user_clients (
        client_id CHAR(36) NOT NULL PRIMARY KEY,
        email VARCHAR(255) DEFAULT NULL,
        accent VARCHAR(255) DEFAULT NULL,
        age VARCHAR(255) DEFAULT NULL,
        gender VARCHAR(255) DEFAULT NULL,
        UNIQUE full_index (client_id, email),
        KEY email_index (email)
      );
      
      CREATE TABLE users (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) DEFAULT NULL,
        send_emails BOOLEAN NOT NULL DEFAULT FALSE,
        has_downloaded BOOLEAN NOT NULL DEFAULT FALSE,
        UNIQUE KEY email (email)
      );
      
      CREATE TABLE sentences (
        id VARCHAR(255) NOT NULL,
        text TEXT CHARACTER SET utf8 NOT NULL,
        is_used BOOLEAN DEFAULT FALSE NOT NULL,
        PRIMARY KEY (id)
      );
      
      CREATE TABLE clips (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        path VARCHAR(255) NOT NULL,
        sentence TEXT CHARACTER SET utf8 NOT NULL,
        original_sentence_id VARCHAR(255) NOT NULL,
        sex VARCHAR(255) NOT NULL,
        age VARCHAR(255) NOT NULL,
        native_language VARCHAR(255) NOT NULL,
        UNIQUE KEY client_sentence_index (client_id,original_sentence_id),
        UNIQUE KEY path_index (path),
        KEY original_sentence_id (original_sentence_id),
        CONSTRAINT clips_ibfk_1 FOREIGN KEY (original_sentence_id) REFERENCES sentences (id),
        CONSTRAINT clips_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id)
      );
      
      CREATE TABLE votes (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        clip_id BIGINT(20) UNSIGNED NOT NULL,
        is_valid TINYINT(1) DEFAULT NULL,
        client_id CHAR(36) NOT NULL,
        UNIQUE KEY clip_client_index (clip_id,client_id),
        KEY client_id (client_id),
        CONSTRAINT votes_ibfk_1 FOREIGN KEY (clip_id) REFERENCES clips (id),
        CONSTRAINT votes_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
