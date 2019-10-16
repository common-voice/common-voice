export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
    CREATE TABLE teams (
      team_id CHAR(36) NOT NULL PRIMARY KEY,
      teamname TEXT NOT NULL DEFAULT (''),
      leader CHAR(36) NOT NULL,
      invite_link TEXT DEFAULT NULL DEFAULT (''),
      created_at DATETIME DEFAULT now(),
      logo_url TEXT DEFAULT NULL DEFAULT (''),
      FOREIGN KEY (leader) REFERENCES user_clients(client_id)
    );
    
    CREATE TABLE user_client_teams (
      client_id CHAR(36) NOT NULL,
      team_id CHAR(36) NOT NULL,
      created_at DATETIME DEFAULT now(),
      PRIMARY KEY (client_id, team_id),
      FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
      FOREIGN KEY (team_id) REFERENCES teams(team_id)
    );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
