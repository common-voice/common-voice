type Locale = {
  localeToken: string;
  sentenceTarget: number;
};

const locales: Locale[] = [
  {
    localeToken: 'ace',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ady',
    sentenceTarget: 750,
  },
  {
    localeToken: 'an',
    sentenceTarget: 750,
  },
  {
    localeToken: 'arn',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ast',
    sentenceTarget: 750,
  },
  {
    localeToken: 'bxr',
    sentenceTarget: 750,
  },
  {
    localeToken: 'cak',
    sentenceTarget: 750,
  },
  {
    localeToken: 'co',
    sentenceTarget: 750,
  },
  {
    localeToken: 'dsb',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ff',
    sentenceTarget: 750,
  },
  {
    localeToken: 'gom',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ht',
    sentenceTarget: 750,
  },
  {
    localeToken: 'izh',
    sentenceTarget: 750,
  },
  {
    localeToken: 'kbd',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ki',
    sentenceTarget: 750,
  },
  {
    localeToken: 'km',
    sentenceTarget: 750,
  },
  {
    localeToken: 'knn',
    sentenceTarget: 750,
  },
  {
    localeToken: 'kpv',
    sentenceTarget: 750,
  },
  {
    localeToken: 'kw',
    sentenceTarget: 750,
  },
  {
    localeToken: 'lij',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mai',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mg',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mhr',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mni',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mos',
    sentenceTarget: 750,
  },
  {
    localeToken: 'mrj',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ms',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ne-NP',
    sentenceTarget: 750,
  },
  {
    localeToken: 'nia',
    sentenceTarget: 750,
  },
  {
    localeToken: 'nyn',
    sentenceTarget: 750,
  },
  {
    localeToken: 'oc',
    sentenceTarget: 750,
  },
  {
    localeToken: 'pap-AW',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ps',
    sentenceTarget: 750,
  },
  {
    localeToken: 'quc',
    sentenceTarget: 750,
  },
  {
    localeToken: 'quy',
    sentenceTarget: 750,
  },
  {
    localeToken: 'sc',
    sentenceTarget: 750,
  },
  {
    localeToken: 'scn',
    sentenceTarget: 750,
  },
  {
    localeToken: 'shi',
    sentenceTarget: 750,
  },
  {
    localeToken: 'skr',
    sentenceTarget: 750,
  },
  {
    localeToken: 'so',
    sentenceTarget: 750,
  },
  {
    localeToken: 'syr',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ti',
    sentenceTarget: 750,
  },
  {
    localeToken: 'tw',
    sentenceTarget: 750,
  },
  {
    localeToken: 'ty',
    sentenceTarget: 750,
  },
  {
    localeToken: 'uby',
    sentenceTarget: 750,
  },
  {
    localeToken: 'udm',
    sentenceTarget: 750,
  },
  {
    localeToken: 'vec',
    sentenceTarget: 750,
  },
  {
    localeToken: 'yi',
    sentenceTarget: 750,
  },
];

export const up = async function (db: any): Promise<any> {
  db.runSql(`
  ALTER TABLE locales ADD COLUMN target_sentence_count SMALLINT NOT NULL DEFAULT 5000;
  `);
  //remove existing test variant data
  // const languageQuery = await db.runSql(
  //   `SELECT id, name FROM locales where name is not null`
  // );
  // // {en: 1, fr: 2}
  // const mappedLanguages = languageQuery.reduce((obj: any, current: any) => {
  //   obj[current.name] = current.id;
  //   return obj;
  // }, {});
  // for (const row of VARIANTS) {
  //   await db.runSql(
  //     `INSERT INTO variants (locale_id, sentenceTarget, variant_name) VALUES ( ${
  //       mappedLanguages[row['locale_name']] +
  //       ',"' +
  //       row['sentenceTarget'] +
  //       '","' +
  //       row['variant_name'] +
  //       '"'
  //     })`
  //   );
  // }
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    `);
};
