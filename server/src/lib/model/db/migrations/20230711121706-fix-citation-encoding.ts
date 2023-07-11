export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    ALTER TABLE sentences MODIFY COLUMN source text CHARACTER SET utf8mb4 DEFAULT NULL;
  `)
}

export const down = async function (): Promise<any> {
  return null
}
