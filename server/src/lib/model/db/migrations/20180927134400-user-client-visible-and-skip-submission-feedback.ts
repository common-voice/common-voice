export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients
        ADD COLUMN visible BOOLEAN DEFAULT FALSE,
        ADD COLUMN skip_submission_feedback BOOLEAN DEFAULT FALSE;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
