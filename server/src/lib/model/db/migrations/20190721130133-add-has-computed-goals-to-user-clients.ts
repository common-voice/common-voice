export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients
        ADD COLUMN has_computed_goals BOOL NOT NULL DEFAULT FALSE;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
