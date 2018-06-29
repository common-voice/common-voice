export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE users
        ADD COLUMN basket_token TEXT;
    `
  );
};
