export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE sentence_metadata
    SET variant_id=(SELECT id FROM variants WHERE variant_token = 'ady-Cyrl')
    WHERE locale_id=(SELECT id from locales WHERE name='ady')
      AND variant_id IS NULL
  `)
};

export const down = async function (): Promise<any> {
  return null;
};
