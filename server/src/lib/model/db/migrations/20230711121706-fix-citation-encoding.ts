export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE sentences ADD COLUMN source_new text CHARACTER SET utf8mb4 DEFAULT NULL
  `)

  await db.runSql(`
    UPDATE sentences SET source_new = source
  `)

  await db.runSql(`
    ALTER TABLE sentences CHANGE COLUMN source source_old text
  `)

  await db.runSql(`
    ALTER TABLE sentences CHANGE COLUMN source_new source text CHARACTER SET utf8mb4 DEFAULT NULL
  `)
}

export const down = async function (): Promise<any> {
  return null
}
