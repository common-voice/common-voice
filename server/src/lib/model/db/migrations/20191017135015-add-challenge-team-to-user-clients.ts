export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    ALTER TABLE user_clients ADD COLUMN challenge_team VARCHAR(255) DEFAULT NULL;
    ALTER TABLE user_clients ADD CONSTRAINT uc_ibfk_1 FOREIGN KEY (challenge_team) REFERENCES teams(team_name);
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
