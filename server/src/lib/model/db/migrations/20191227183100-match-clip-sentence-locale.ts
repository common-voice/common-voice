export const up = async function(db: any): Promise<any> {
  // Note: Manual backfill to follow.
  return db.runSql(`
    UPDATE clips
    INNER JOIN sentences
    	ON clips.original_sentence_id = sentences.id
  	SET clips.locale_id = sentences.locale_id
    WHERE clips.locale_id <> sentences.locale_id
  `);
};

export const down = function(): Promise<any> {
  return null;
};
