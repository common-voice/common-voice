export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
    CREATE TABLE taxonomies (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      tax_name VARCHAR(255) NOT NULL,
      type ENUM('sentences', 'clips', 'both') NOT NULL,

      UNIQUE (tax_name)
    );

    CREATE TABLE taxonomy_terms (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      taxonomy_id INT UNSIGNED NOT NULL,
      term_name VARCHAR(255) NOT NULL,
      user_selectable BOOLEAN DEFAULT FALSE,

      UNIQUE (taxonomy_id, term_name),
      FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id)
    );

    CREATE TABLE taxonomy_entries (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

      term_id INT UNSIGNED NOT NULL,
      sentence_id VARCHAR(255) DEFAULT NULL,
      clip_id BIGINT(20) UNSIGNED DEFAULT NULL,

      FOREIGN KEY (term_id) REFERENCES taxonomy_terms(id),
      FOREIGN KEY (sentence_id) REFERENCES sentences(id),
      FOREIGN KEY (clip_id) REFERENCES clips(id)
    );
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
