export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    ALTER TABLE user_client_accents
      ADD COLUMN accent_id INT UNSIGNED,
      ADD COLUMN created_at DATETIME DEFAULT NOW(),
      CHANGE COLUMN accent accent_token VARCHAR(255),
      DROP INDEX client_id,
      ADD KEY client_id (client_id),
      ADD CONSTRAINT FOREIGN KEY (accent_id) REFERENCES accents (id),
      ADD CONSTRAINT client_accent UNIQUE (client_id, locale_id, accent_id);`
  );

  await db.runSql(`
    UPDATE user_client_accents ua
      SET accent_token = "unspecified"
      WHERE ua.accent_token = "";
  `);

  await db.runSql(`
    UPDATE user_client_accents ua 
      SET accent_id = 
        (SELECT id FROM accents 
          WHERE ua.locale_id = accents.locale_id 
          AND ua.accent_token = accents.accent_token
        )
      WHERE ua.accent_token IS NOT NULL;
  `);
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql(`
    ALTER TABLE user_client_accents
      DROP COLUMN accent_id,
      DROP COLUMN created_at,
      CHANGE COLUMN accent_token accent VARCHAR(255) NOT NULL,
      DROP INDEX client_id,
      ADD KEY client_id (client_id, locale_id),
      DROP KEY accent_id,
      DROP KEY client_accent;
  `);
};
