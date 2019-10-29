export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    ALTER TABLE user_clients MODIFY visible TINYINT(2) DEFAULT 0;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
