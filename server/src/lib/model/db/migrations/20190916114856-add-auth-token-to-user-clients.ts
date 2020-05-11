export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients ADD COLUMN auth_token TEXT;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
