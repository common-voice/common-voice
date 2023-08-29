export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE sentences SET is_used = FALSE
    WHERE (created_at > '2023-05-01 00:00:00' AND text REGEXP '.*\\\\?[a-zāčēģīķļņšūžâîûüöç].*') OR text = ''
  `);

  await db.runSql(`
    UPDATE sentences SET is_used = FALSE
    WHERE locale_id=(SELECT id from locales WHERE name='lv')
      AND source REGEXP '.*\\\\?[a-zāčēģīķļņšūžâîûüöç].*' 
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
