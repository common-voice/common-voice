export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE user_clients DROP COLUMN has_downloaded;

      CREATE TABLE downloaders (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        locale_id SMALLINT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT now(),
        UNIQUE KEY email_locale (email, locale_id)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
