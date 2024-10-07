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

const getLanguages = function (db: any): Promise<any> {
  const languages = Object.keys(ACCENTS).map(key => `"${key}"`).join(', ');
  return db.runSql(`SELECT id, name FROM locales WHERE name IN (${languages})`);
};

const getAccents = function (languages: any[]): any[] {
  const accents = [];
  for (const row in languages) {
    const locale_id = row.id;
    const name = row.name;
    for (const accent_token in ACCENTS[name]) {
      const accent_name = ACCENTS[name][accent_token];
      accents.push({ locale_id, accent_name, accent_token });
    }
  }
  return accents;
};

export const up = function (db: any): Promise<any> {
  const languages = await getLanguages(db);
  const accents = getAccents(languages);
  if (!accents.length) {
    return null;
  }
  const values = accents.map(accent => `(${accent.locale_id}, "${accent.accent_name}", "${accent.accent_token}")`).join(', ');
  return db.runSql(`INSERT INTO accents (locale_id, accent_name, accent_token) VALUES ${values}`);
};

export const down = function (): Promise<any> {
  const languages = await getLanguages(db);
  const accents = getAccents(languages);
  if (!accents.length) {
    return null;
  }
  const conditions = accents.map(accent => `
    (     locale_id = ${accent.locale_id}
      AND accent_name = "${accent.accent_name}"
      AND accent_token = "${accent.accent_token}"
    )
  `).join(' OR ');
  return db.runSql(`DELETE FROM accents WHERE ${conditions}`);
};
