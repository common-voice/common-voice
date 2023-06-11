// insert accents to nan-tw

const ACCENTS: any = {
  'nan-tw': {
    keelung_city: '出生地：基隆市',
    taipei_city: '出生地：臺北市',
    new_taipei_city: '出生地：新北市',
    taoyuan_city: '出生地：桃園市',
    hsinchu_county: '出生地：新竹縣',
    hsinchu_city: '出生地：新竹市',
    miaoli_county: '出生地：苗栗縣',
    taichung_city: '出生地：臺中市',
    changhua_county: '出生地：彰化縣',
    nantou_county: '出生地：南投縣',
    yunlin_county: '出生地：雲林縣',
    chiayi_county: '出生地：嘉義縣',
    chiayi_city: '出生地：嘉義市',
    tainan_city: '出生地：臺南市',
    kaohsiung_city: '出生地：高雄市',
    pingtung_county: '出生地：屏東縣',
    yilan_county: '出生地：宜蘭縣',
    hualien_county: '出生地：花蓮縣',
    taitung_county: '出生地：臺東縣',
    penghu_county: '出生地：澎湖縣',
    kinmen_county: '出生地：金門縣',
    lienchiang_county: '出生地：連江縣',
    other_county: '出生地：其他',
  },
};

export const up = async function (db: any): Promise<any> {
  for (const language in ACCENTS) {
    const [row] = await db.runSql(
      `SELECT id FROM locales WHERE name = "${language}"`
    );

    if (row && row.id) {
      for (const accent_token in ACCENTS[language]) {
        await db.runSql(`
          INSERT INTO accents (locale_id, accent_name, accent_token)
            VALUES (${row.id}, "${ACCENTS[language][accent_token]}", "${accent_token}")
        `);
      }
    }
  }
};

export const down = function (): Promise<any> {
  return null;
};
