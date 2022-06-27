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
  {
    localeToken: 'am',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'fo',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'is',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'kaa',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'my',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'si',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'sq',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'te',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'tg',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'tk',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'tl',
    sentenceTarget: 2000,
  },
  {
    localeToken: 'yo',
    sentenceTarget: 2000,
  },
];

export const up = async function (db: any): Promise<any> {
  // console.log(locales);
  const checkCol = await db.runSql(
    `SHOW COLUMNS FROM locales LIKE '%target_sentence_count%'`
  );

  if (checkCol.length > 0) {
    return;
  }

  await db.runSql(`
    ALTER TABLE locales ADD COLUMN target_sentence_count SMALLINT NOT NULL DEFAULT 5000;
  `);

  for (const row of locales) {
    await db.runSql(` 
    UPDATE locales
    SET target_sentence_count = ${row.sentenceTarget}
    WHERE name = "${row.localeToken}"`);
  }
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE locales
    DROP COLUMN target_sentence_count
  `);
};
