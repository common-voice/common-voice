export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE IF NOT EXISTS locales (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name TEXT CHARACTER SET utf8 NOT NULL
      );
      
      INSERT INTO locales (id, name) VALUES (1, 'en');
      
      ALTER TABLE sentences ADD COLUMN locale_id SMALLINT NOT NULL DEFAULT 1;
      
      ALTER TABLE clips ADD COLUMN locale_id SMALLINT NOT NULL DEFAULT 1;
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
