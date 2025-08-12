// Template for "Fix Accent Naming"
// Update the Basque language accent to fix the typo
const LOCALE = 'eu'
const ACCENT_TOKEN = 'mendebalekoa'
const OLD_NAME =
  'Mendebalekoa (Araka, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'
const NEW_NAME =
  'Mendebalekoa (Araba, Bizkaia, Gipuzkoako mendebaleko herri batzuk)'

//
// Do not change the code below unless database structure has been changed
//
export const up = async function (db: any): Promise<any> {
  console.log(NEW_NAME, LOCALE, ACCENT_TOKEN)
  await db.runSql(
    `
    UPDATE accents
    SET accent_name = ?
    WHERE
      locale_id = (SELECT id FROM locales WHERE name = ? )
      AND accent_token = ?
  `,
    [NEW_NAME, LOCALE, ACCENT_TOKEN]
  )
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(
    `
    UPDATE accents
    SET accent_name = ?
    WHERE
      locale_id = (SELECT id FROM locales WHERE name = ? )
      AND accent_token = ?
  `,
    [OLD_NAME, LOCALE, ACCENT_TOKEN]
  )
}
