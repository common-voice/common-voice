export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE downloaders MODIFY COLUMN id int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
