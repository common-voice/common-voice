export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      RENAME TABLE users TO deprecated_users;
      
      ALTER TABLE user_clients
        CHANGE COLUMN accent deprecated_accent VARCHAR(255),
        CHANGE COLUMN bucket deprecated_bucket VARCHAR(255),
        CHANGE COLUMN sso_id deprecated_sso_id VARCHAR(255);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
