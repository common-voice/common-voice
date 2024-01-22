export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO genders(gender)
    VALUES 
      ('intersex'),
      ('transgender'),
      ('non-binary'),
      ('do_not_wish_to_say')
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DELETE FROM genders WHERE gender IN ('intersex', 'transgender', 'non-binary', 'do_not_wish_to_say')
  `)

  return null
}
