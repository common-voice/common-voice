export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE genders
    SET gender = 'female_feminine'
    WHERE gender = 'female'
  `)

  await db.runSql(`
    UPDATE genders
    SET gender = 'male_masculine'
    WHERE gender = 'male'
  `)

  const [genderQuery] = await db.runSql(`SELECT id FROM genders WHERE gender = 'other'`)

  await db.runSql(`
    UPDATE demographics
    SET gender_id = NULL
    WHERE gender_id = ${genderQuery.id}
  `)

  await db.runSql(`
    DELETE FROM genders
    WHERE id = ${genderQuery.id}
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO genders(gender)
    VALUES ('other')
  `)

  await db.runSql(`
    UPDATE genders
    SET gender = 'female'
    WHERE gender = 'female_feminine'
  `)

  await db.runSql(`
    UPDATE genders
    SET gender = 'male'
    WHERE gender = 'male_masculine'
  `)
}
