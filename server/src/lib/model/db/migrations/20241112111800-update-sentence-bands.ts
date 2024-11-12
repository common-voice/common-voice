export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO accents(locale_id, accent_name, accent_token)
    VALUES ((SELECT id FROM locales WHERE name = "ady"),"Абдзах (Abzah)","abzakh"),
      ((SELECT id FROM locales WHERE name = "ady"),"Бжъэдыгъу (Bjeduğ)","bzhedug"),
      ((SELECT id FROM locales WHERE name = "ady"),"Хьатыкъуай (Hatıkuay)","hatikuay"),
      ((SELECT id FROM locales WHERE name = "ady"),"Шапсыгъ (Şapsığ)","shapsug"),
      ((SELECT id FROM locales WHERE name = "ady"),"Кıэмгуй (Çemguy)","temirgoy"),
      ((SELECT id FROM locales WHERE name = "ady"),"Убых (Ubıh)","ubykh"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Бахъсэн (Baksan)","bakhsan"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Беслъэней (Besleney)","besleney"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Псыжь (Adıgey)","kuban"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Псыжь-инжыдж (Karaçay-Çerkes)","kuban_zelenchuk"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Малкэ (Malka)","malka"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Мэздэгу (Mozdok)","mozdok"),
      ((SELECT id FROM locales WHERE name = "kbd"),"Джылэхъстэней (Gilahsteney)", "terek")
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
