export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE downloaders DROP KEY email_locale;

      ALTER TABLE user_client_accents
        DROP FOREIGN KEY user_client_accents_ibfk_1,
        DROP FOREIGN KEY user_client_accents_ibfk_2;
      ALTER TABLE user_client_accents DROP INDEX client_locale;

      ALTER TABLE user_client_activities DROP FOREIGN KEY uca_ibfk_2;

      ALTER TABLE user_client_locale_buckets
        DROP FOREIGN KEY user_client_locale_buckets_ibfk_2;


      ALTER TABLE locales MODIFY id INT NOT NULL AUTO_INCREMENT;

      ALTER TABLE clips
        MODIFY locale_id INT,
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);

      ALTER TABLE sentences
        MODIFY locale_id INT,
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);

      ALTER TABLE downloaders
        MODIFY locale_id INT,
        ADD CONSTRAINT UNIQUE (email, locale_id),
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);

      ALTER TABLE user_client_accents
        MODIFY locale_id INT,
        ADD CONSTRAINT UNIQUE (client_id, locale_id),
        ADD CONSTRAINT FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);

      ALTER TABLE user_client_activities
        MODIFY locale_id INT,
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);

      ALTER TABLE user_client_locale_buckets
        MODIFY locale_id INT,
        ADD CONSTRAINT FOREIGN KEY (locale_id) REFERENCES locales(id);
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
