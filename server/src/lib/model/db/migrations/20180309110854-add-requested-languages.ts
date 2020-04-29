export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE requested_languages (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        language TEXT CHARACTER SET utf8 NOT NULL,
        UNIQUE(language(200))
      );
      
      CREATE TABLE language_requests (
        requested_languages_id BIGINT(20) UNSIGNED NOT NULL,
        client_id CHAR(36) NOT NULL,
        PRIMARY KEY (requested_languages_id, client_id)
      );
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
