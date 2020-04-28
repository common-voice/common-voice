export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE clips ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE sentences ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE user_clients ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE votes ADD COLUMN created_at DATETIME DEFAULT now();
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
