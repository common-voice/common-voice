
export const up = async function (db: any): Promise<any> {
  // Update the Basque language accent to fix the typo
  await db.runSql(`
    UPDATE accents
    SET accent_name = 'Mendebalekoa (Araba, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'
    WHERE locale_id = (SELECT id FROM locales WHERE name = 'eu') 
      AND accent_name = 'Mendebalekoa (Araka, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'
  `);
};

export const down = async function (db: any): Promise<any> {
  // Revert the Basque language accent to its original state
  await db.runSql(`
    UPDATE accents
    SET accent_name = 'Mendebalekoa (Araka, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'
    WHERE locale_id = (SELECT id FROM locales WHERE name = 'eu') 
      AND accent_name = 'Mendebalekoa (Araba, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'
  `);
};
