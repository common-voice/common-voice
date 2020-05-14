export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
 	  ALTER TABLE taxonomy_entries ADD CONSTRAINT term_sentence_unique UNIQUE KEY (term_id, sentence_id);
    ALTER TABLE taxonomy_entries ADD CONSTRAINT term_clip_unique UNIQUE KEY (term_id, clip_id);

    ALTER TABLE clips ADD INDEX (is_valid, locale_id);
    ALTER TABLE sentences ADD INDEX (source(50));
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
