export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE skipped_sentences (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sentence_id VARCHAR(255) NOT NULL,
        client_id CHAR(36) NOT NULL,
        created_at DATETIME DEFAULT now(),
        FOREIGN KEY (sentence_id) REFERENCES sentences (id),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id)
      );
    `
  );
};
