export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE awards ADD COLUMN notification_seen_at TIMESTAMP NULL DEFAULT NULL;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
