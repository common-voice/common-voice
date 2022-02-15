const VARIANTS = [
  { locale_name: 'en', name: 'South African English', token: 'en-ZA' },
  { locale_name: 'en', name: 'Canadian English', token: 'en-CA' },
  { locale_name: 'en', name: 'British English', token: 'en-GB' },
  { locale_name: 'en', name: 'American English', token: 'en-US' },
  { locale_name: 'cy', name: 'North-Western Welsh', token: 'cy-north' },
];

export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    CREATE TABLE variants (
        id int(10) unsigned AUTO_INCREMENT NOT NULL,
        locale_id int(11) NOT NULL,
        variant_name varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        variant_token varchar(255) CHARACTER SET utf8mb4 NULL,
        type varchar(255) CHARACTER SET utf8mb4 NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY variant_key (locale_id,variant_name),
        CONSTRAINT variants_ibfk_1 FOREIGN KEY (locale_id) REFERENCES locales (id)
    )
    `
  );
  await db.runSql(
    `
    CREATE TABLE user_client_variants (
        id bigint(20) unsigned AUTO_INCREMENT NOT NULL,
        client_id char(36) NOT NULL,
        locale_id INT(11) NOT NULL,
        variant_id int(10) unsigned DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY client_locale (client_id, locale_id),
        KEY client_id (client_id),
        KEY variant_id (variant_id),
        CONSTRAINT user_client_variants_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE,
        CONSTRAINT user_client_variants_ibfk_2 FOREIGN KEY (variant_id) REFERENCES variants (id),
        CONSTRAINT variants_ibfk_4 FOREIGN KEY (locale_id) REFERENCES locales (id)
    )
    `
  );

  const languageQuery = await db.runSql(
    `SELECT id, name FROM locales where name is not null`
  );
  // {en: 1, fr: 2}
  const mappedLanguages = languageQuery.reduce((obj: any, current: any) => {
    obj[current.name] = current.id;
    return obj;
  }, {});
  for (const row of VARIANTS) {
    await db.runSql(
      `INSERT INTO variants (locale_id, variant_token, variant_name) VALUES ( ${
        mappedLanguages[row['locale_name']] +
        ',"' +
        row['token'] +
        '","' +
        row['name'] +
        '"'
      })`
    );
  }
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DROP TABLE user_client_variants;
    DROP TABLE variants;
  `);
};
