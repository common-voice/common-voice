export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    ALTER TABLE skipped_sentences DROP FOREIGN KEY skipped_sentences_ibfk_1;
    ALTER TABLE skipped_sentences ADD CONSTRAINT skipped_sentences_ibfk_1 FOREIGN KEY (sentence_id) REFERENCES sentences (id) ON DELETE CASCADE;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
