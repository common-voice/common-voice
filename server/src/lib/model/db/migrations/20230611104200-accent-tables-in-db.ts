// insert accents to nan-tw

export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO accents(locale_id, accent_name, accent_token)
    VALUES 
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：基隆市","keelung_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：臺北市","taipei_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：新北市","new_taipei_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：桃園市","taoyuan_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：新竹縣","hsinchu_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：新竹市","hsinchu_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：苗栗縣","miaoli_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：臺中市","taichung_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：彰化縣","changhua_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：南投縣","nantou_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：雲林縣","yunlin_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：嘉義縣","chiayi_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：嘉義市","chiayi_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：臺南市","tainan_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：高雄市","kaohsiung_city"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：屏東縣","pingtung_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：宜蘭縣","yilan_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：花蓮縣","hualien_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：臺東縣","taitung_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：澎湖縣","penghu_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：金門縣","kinmen_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：連江縣","lienchiang_county"),
      ((SELECT id FROM locales WHERE name = "nan-tw"),"出生地：其他","other_county")
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
