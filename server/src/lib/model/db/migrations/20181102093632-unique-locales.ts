export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
      UPDATE user_client_activities uca SET locale_id = (
        SELECT id
        FROM locales
        WHERE name = (SELECT name from locales WHERE locales.id = uca.locale_id)
        LIMIT 1  
      );
      
      UPDATE IGNORE user_client_locale_buckets uclb SET locale_id = (
        SELECT id
        FROM locales
        WHERE name = (SELECT name from locales WHERE locales.id = uclb.locale_id)
        LIMIT 1  
      );

      ALTER TABLE user_client_locale_buckets
        DROP FOREIGN KEY user_client_locale_buckets_ibfk_2;
      ALTER TABLE user_client_locale_buckets
        ADD CONSTRAINT user_client_locale_buckets_ibfk_2 FOREIGN KEY (locale_id)
        REFERENCES locales(id) ON DELETE CASCADE;
      
      UPDATE IGNORE user_client_accents uca SET locale_id = (
        SELECT id
        FROM locales
        WHERE name = (SELECT name from locales WHERE locales.id = uca.locale_id)
        LIMIT 1  
      );

      ALTER TABLE user_client_accents
        DROP FOREIGN KEY user_client_accents_ibfk_2;
      ALTER TABLE user_client_accents
        ADD CONSTRAINT user_client_accents_ibfk_2 FOREIGN KEY (locale_id)
        REFERENCES locales(id) ON DELETE CASCADE;
      
      DELETE FROM locales USING locales, locales ld
        WHERE locales.id > ld.id AND locales.name = ld.name;
          
      ALTER TABLE locales ADD UNIQUE INDEX name_idx (name(10)) 
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
