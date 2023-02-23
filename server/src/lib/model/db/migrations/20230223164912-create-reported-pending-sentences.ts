export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS reported_pending_sentences (
      id int unsigned NOT NULL AUTO_INCREMENT,
      pending_sentence_id int NOT NULL,
      client_id char(36) NOT NULL,
      reason varchar(255) NOT NULL,
      created_at datetime NOT NULL DEFAULT NOW(),
      updated_at datetime NOT NULL DEFAULT NOW(),
      PRIMARY KEY (id),
      FOREIGN KEY (pending_sentence_id) REFERENCES pending_sentences(id),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
      UNIQUE INDEX unique_report (pending_sentence_id, client_id) 
    );
  `);
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`DROP TABLE IF EXISTS reported_pending_sentences`);
};
