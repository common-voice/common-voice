
export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    CREATE TABLE IF NOT EXISTS sc_sentences 
    (
      id int NOT NULL AUTO_INCREMENT,
      sentence varchar(255) COLLATE utf8mb4_bin NOT NULL,
      source text COLLATE utf8mb4_bin NOT NULL,
      locale_id int(11) NOT NULL,
      batch varchar(255) DEFAULT NULL,
      created_at datetime NOT NULL DEFAULT NOW(),
      updated_at datetime NOT NULL DEFAULT NOW(),
      client_id char(36) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_sentence (sentence, locale_id),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
      FOREIGN KEY (locale_id) REFERENCES locales(id)
    )
  `);

  await db.runSql(`
    CREATE TABLE IF NOT EXISTS sc_votes
    (
      id int NOT NULL AUTO_INCREMENT,
      sc_sentence_id int NOT NULL,
      is_valid tinyint(1) NOT NULL,
      created_at datetime NOT NULL DEFAULT NOW(),
      updated_at datetime NOT NULL DEFAULT NOW(),
      client_id char(36) DEFAULT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (sc_sentence_id) REFERENCES sc_sentences(id),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id)
    );
  `);
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`
    DROP TABLE IF EXISTS sc_sentences, sc_votes
  `);
};
