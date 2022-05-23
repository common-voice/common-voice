type Variant = {
  id?: number;
  variant_name?: string;
  variant_token: string;
  locale_name?: string;
};

const VARIANTS: Variant[] = [
  {
    locale_name: 'cy',
    variant_name: 'North-Western Welsh',
    variant_token: 'cy-northwes',
  },
  {
    locale_name: 'cy',
    variant_name: 'North-Eastern Welsh',
    variant_token: 'cy-northeas',
  },
  {
    locale_name: 'cy',
    variant_name: 'Mid Wales',
    variant_token: 'cy-midwales',
  },
  {
    locale_name: 'cy',
    variant_name: 'South-Western Welsh',
    variant_token: 'cy-southwes',
  },
  {
    locale_name: 'cy',
    variant_name: 'South-Eastern Welsh',
    variant_token: 'cy-southeas',
  },
  {
    locale_name: 'cy',
    variant_name: 'Patagonian Welsh',
    variant_token: 'cy-wladfa',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili Sanifu (EA)',
    variant_token: 'sw-sanifu',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili cha Bara ya Kenya',
    variant_token: 'sw-barake',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiswahili cha Bara ya Tanzania',
    variant_token: 'sw-baratz',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kingwana (DRC)',
    variant_token: 'sw-kingwana',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimvita (KE) - Central dialect',
    variant_token: 'sw-kimvita',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kibajuni (KE) - Northern dialect',
    variant_token: 'sw-kibajuni',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimrima (TZ) - Northern dialect',
    variant_token: 'sw-kimrima',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kiunguja (TZ) - Southern dialect',
    variant_token: 'sw-kiunguja',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kipemba (TZ) - Southern dialect',
    variant_token: 'sw-kipemba',
  },
  {
    locale_name: 'sw',
    variant_name: 'Kimakunduchi/Kikae (TZ) - Southern dialect',
    variant_token: 'sw-kikae',
  },
  {
    locale_name: 'pt',
    variant_name: 'Portuguese (Brasil)',
    variant_token: 'pt-BR',
  },
  {
    locale_name: 'pt',
    variant_name: 'Portuguese (Portugal)',
    variant_token: 'pt-PT',
  },
];

export const up = async function (db: any): Promise<any> {
  //remove existing test variant data

  const languageQuery = await db.runSql(
    `SELECT id, name FROM locales where name is not null`
  );
  // {en: 1, fr: 2}
  const mappedLanguages = languageQuery.reduce((obj: any, current: any) => {
    obj[current.name] = current.id;
    return obj;
  }, {});

  await Promise.all(
    VARIANTS.map(row => {
      db.runSql(
        `INSERT IGNORE INTO variants (locale_id, variant_token, variant_name) VALUES ( ${
          mappedLanguages[row['locale_name']] +
          ',"' +
          row['variant_token'] +
          '","' +
          row['variant_name'] +
          '"'
        })`
      );
    })
  );
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    `);
};
