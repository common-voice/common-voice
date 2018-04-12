export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE IF NOT EXISTS sessions (
        session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,
        expires    int(11) unsigned                 NOT NULL,
        data       text COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id)
      )
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
