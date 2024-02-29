export const up = async function (db: any): Promise<any> {
  const [row] = await db.runSql(`
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'clips' AND COLUMN_NAME = 'duration'
  `);

  if (!row) {
    return db.runSql(`
      ALTER TABLE clips ADD COLUMN duration INT NOT NULL DEFAULT 0,
      ALGORITHM = INPLACE,
      LOCK = NONE;
    `);
  }

  return null;
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`ALTER TABLE clips DROP COLUMN duration`);
};
