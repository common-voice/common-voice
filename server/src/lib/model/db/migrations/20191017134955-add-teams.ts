export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
    CREATE TABLE teams (
      team_name VARCHAR(255) PRIMARY KEY,
      invite_token TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      created_at DATETIME DEFAULT now()
    );
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
