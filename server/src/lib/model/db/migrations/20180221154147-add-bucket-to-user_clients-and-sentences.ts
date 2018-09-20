export const up = async function(db: any): Promise<any> {
  await db.runSql(
    `
      ALTER TABLE user_clients ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
      ALTER TABLE sentences ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
      ALTER TABLE clips ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
