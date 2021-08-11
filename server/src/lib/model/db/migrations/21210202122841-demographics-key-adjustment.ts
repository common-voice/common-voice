export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    ALTER TABLE demographics DROP FOREIGN KEY demographics_ibfk_1;
    ALTER TABLE demographics MODIFY client_id CHAR(36);
    ALTER TABLE demographics ADD CONSTRAINT demographics_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE SET NULL;
  `);
};

export const down = function (): Promise<any> {
  return null;
};
