export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients ADD COLUMN has_login BOOLEAN DEFAULT FALSE;
      
      UPDATE user_clients SET has_login = sso_id IS NOT NULL;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
