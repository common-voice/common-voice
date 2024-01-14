export const up = async function (db: any): Promise<any> {
    return db.runSql( `
        UPDATE locales
        SET target_sentence_count = 2000
        WHERE name = "zgh"
    `);
  };

  export const down = async function (db: any): Promise<any> {
    return db.runSql(`
        UPDATE locales
        SET target_sentence_count = 5000
        WHERE name = "zgh"
    `);
  };
