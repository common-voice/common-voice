export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    ALTER TABLE user_client_accents
      ADD COLUMN accent_id INT UNSIGNED,
      CHANGE COLUMN accent legacy_accent_token VARCHAR(255),
      DROP INDEX client_id,
      ADD KEY client_id (client_id),
      ADD CONSTRAINT FOREIGN KEY (accent_id) REFERENCES accents (id),
      ADD CONSTRAINT client_accent UNIQUE (client_id, locale_id, accent_id);`
  );

  await db.runSql(`
    UPDATE user_client_accents ua 
      SET accent_id = 
        (SELECT id FROM accents 
          WHERE ua.locale_id = accents.locale_id 
          AND ua.legacy_accent_token = accents.legacy_accent_token
        )
      WHERE ua.legacy_accent_token IS NOT NULL;
  `)
};

export const down = function (): Promise<any> {
  return null;
};