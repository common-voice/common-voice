export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    IF NOT EXISTS (
      SELECT
        NULL
      FROM
        INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = 'clips'
        AND COLUMN_NAME = 'duration' 
      ) THEN
      ALTER TABLE clips ADD COLUMN duration INT NOT NULL DEFAULT 0,
      ALGORITHM = INPLACE,
      LOCK = NONE;
      END IF;
    `);
};

export const down = async function (db: any): Promise<any> {
  return db.runSql(`ALTER TABLE clips DROP COLUMN duration`);
};
