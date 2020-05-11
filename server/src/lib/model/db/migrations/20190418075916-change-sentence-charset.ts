export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE sentences MODIFY text TEXT CHARSET utf8mb4 NOT NULL;
      ALTER TABLE clips MODIFY sentence TEXT CHARSET utf8mb4 NOT NULL;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
