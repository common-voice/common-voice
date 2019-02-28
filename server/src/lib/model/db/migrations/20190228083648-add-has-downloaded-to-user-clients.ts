export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients
        ADD COLUMN has_downloaded BOOLEAN DEFAULT FALSE;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
