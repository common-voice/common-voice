export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS bulk_submissions (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      status TINYINT UNSIGNED NOT NULL,
      locale_id INT NOT NULL,
      size BIGINT UNSIGNED,
      path VARCHAR(255),
      name VARCHAR(255),
      submitter CHAR(36) DEFAULT NULL,
      reviewer CHAR(36) DEFAULT NULL,
      import_status ENUM(
        'created',
        'running',
        'success',
        'warning',
        'failed'
      ),
      updated_at DATETIME NOT NULL DEFAULT NOW(),
      created_at DATETIME NOT NULL DEFAULT NOW(),
      PRIMARY KEY (id),
      UNIQUE (path),
      FOREIGN KEY (status) REFERENCES bulk_submission_status(id),
      FOREIGN KEY (locale_id) REFERENCES locales(id) ON DELETE CASCADE,
      FOREIGN KEY (submitter) REFERENCES user_clients(client_id) ON DELETE SET NULL,
      FOREIGN KEY (reviewer) REFERENCES user_clients(client_id) ON DELETE SET NULL
    )`
  );
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`
    DROP TABLE bulk_submissions
  `);
};
