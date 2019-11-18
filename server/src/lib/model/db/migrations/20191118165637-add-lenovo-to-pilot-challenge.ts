export const up = async function(db: any): Promise<any> {
  return db.runSql(`
    INSERT INTO teams (url_token, name, challenge_id)
    VALUES ('lenovo', 'Lenovo', (SELECT id FROM challenges WHERE url_token='pilot'));
  `);
};

export const down = function(): Promise<any> {
  return null;
};
