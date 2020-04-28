export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients
        ADD COLUMN sso_id VARCHAR(255) UNIQUE,
        ADD COLUMN username TEXT NOT NULL DEFAULT '',
        ADD COLUMN basket_token TEXT;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
