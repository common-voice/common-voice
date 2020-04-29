export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients ADD COLUMN avatar_url TEXT;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
