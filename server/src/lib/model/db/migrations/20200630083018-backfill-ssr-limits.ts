export const up = async function (db: any): Promise<any> {
  // backfill based on analysis: https://docs.google.com/spreadsheets/d/1ErGZuS319j4176lyyrLzhSe3-QUvKN-1LgAp_eiNchI/edit#gid=0
  const backfillIds = [
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    15,
    19,
    23,
    30,
    34,
    36,
    38,
    41,
    46,
    48,
    56,
    63,
    64,
    67,
    73,
    74,
    77,
    2573,
    17883,
    26262,
  ];

  return db.runSql(`
    UPDATE sentences
    SET has_valid_clip = 1
    WHERE EXISTS(SELECT
      * FROM clips WHERE original_sentence_id = sentences.id
      AND is_valid = 1
    )
    AND locale_id in (${backfillIds.join(', ')})
    AND has_valid_clip = 0
  `);
};

export const down = function (): Promise<any> {
  return null;
};
