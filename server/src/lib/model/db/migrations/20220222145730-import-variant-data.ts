const VARIANTS = [
  { locale_name: 'cy', name: 'North-Western Welsh', token: 'cy-northwes' },
  { locale_name: 'cy', name: 'North-Eastern Welsh', token: 'cy-northeas' },
  { locale_name: 'cy', name: 'Mid Wales', token: 'cy-midwales' },
  { locale_name: 'cy', name: 'South-Western Welsh', token: 'cy-southwes' },
  { locale_name: 'cy', name: 'South-Eastern Welsh', token: 'cy-southeas' },
  { locale_name: 'cy', name: 'Patagonian Welsh', token: 'cy-wladfa' },
  { locale_name: 'sw', name: 'Kiswahili Sanifu (EA)', token: 'sw-sanifu' },
  {
    locale_name: 'sw',
    name: 'Kiswahili cha Bara ya Kenya',
    token: 'sw-barake',
  },
  {
    locale_name: 'sw',
    name: 'Kiswahili cha Bara ya Tanzania',
    token: 'sw-baratz',
  },
  { locale_name: 'sw', name: 'Kingwana (DRC)', token: 'sw-kingwana' },
  {
    locale_name: 'sw',
    name: 'Kimvita (KE) - Central dialect',
    token: 'sw-kimvita',
  },
  {
    locale_name: 'sw',
    name: 'Kibajuni (KE) - Northern dialect',
    token: 'sw-kibajuni',
  },
  {
    locale_name: 'sw',
    name: 'Kimrima (TZ) - Northern dialect',
    token: 'sw-kimrima',
  },
  {
    locale_name: 'sw',
    name: 'Kiunguja (TZ) - Southern dialect',
    token: 'sw-kiunguja',
  },
  {
    locale_name: 'sw',
    name: 'Kipemba (TZ) - Southern dialect',
    token: 'sw-kipemba',
  },
  {
    locale_name: 'sw',
    name: 'Kimakunduchi/Kikae (TZ) - Southern dialect',
    token: 'sw-kikae',
  },
  { locale_name: 'pt', name: 'Portuguese (Brasil)', token: 'pt-BR' },
  { locale_name: 'pt', name: 'Portuguese (Portugal)', token: 'pt-PT' },
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
