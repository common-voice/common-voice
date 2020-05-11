export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE custom_goals
        ADD COLUMN locale_id SMALLINT NOT NULL DEFAULT 1;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
