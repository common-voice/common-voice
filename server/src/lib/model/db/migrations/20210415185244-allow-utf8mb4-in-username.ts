export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
      ALTER TABLE user_clients MODIFY COLUMN username text CHARACTER SET utf8mb4 NOT NULL;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
