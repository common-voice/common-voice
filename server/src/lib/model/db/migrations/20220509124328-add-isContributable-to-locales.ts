export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    ALTER TABLE locales
      ADD COLUMN native_name varchar(255) CHARACTER SET utf8mb4,
      ADD COLUMN is_contributable BOOLEAN DEFAULT 0 NOT NULL,
      ADD COLUMN is_translated BOOLEAN DEFAULT 0 NOT NULL,
      ADD COLUMN text_direction ENUM('LTR', 'RTL', 'TTB', 'BTT') DEFAULT 'LTR' NOT NULL
    `
  );
};

export const down = async function (db: any): Promise<any> {
  return await db.runSql(`
  ALTER TABLE locales 
    DROP COLUMN native_name,
    DROP COLUMN is_contributable,
    DROP COLUMN is_translated,
    DROP COLUMN text_direction
`);
};
