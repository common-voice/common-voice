export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE sentences ADD INDEX locale_clip_ct_idx (locale_id, clips_count);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
