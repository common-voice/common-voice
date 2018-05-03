export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE IF NOT EXISTS user_client_locale_buckets (
        client_id CHAR(36) NOT NULL,
        locale_id SMALLINT UNSIGNED NOT NULL,
        bucket ENUM ('train', 'dev', 'test') DEFAULT 'train',
        PRIMARY KEY (client_id, locale_id),
        FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
        FOREIGN KEY (locale_id) REFERENCES locales(id)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
