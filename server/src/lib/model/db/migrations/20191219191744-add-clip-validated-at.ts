export const up = async function (db: any): Promise<any> {
  // Note: Manual backfill to follow.
  return db.runSql(`
    ALTER TABLE clips ADD COLUMN validated_at DATE DEFAULT NULL;
  `);
};

export const down = function (): Promise<any> {
  return null;
};
