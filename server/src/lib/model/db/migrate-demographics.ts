import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function migrateDemographics() {
  await db.query(
    `
      INSERT INTO demographics (client_id, age, gender)  (
        SELECT client_id, age, gender
        FROM user_clients
      )

      INSERT INTO user_client_demographics (client_id, demographic_id)  (
        SELECT user_clients.client_id, demographics.id AS demographic_id
        FROM user_clients
        INNER JOIN demographics ON user_clients.client_id = demographics.client_id
      )

      INSERT INTO clip_demographics (clip_id, demographic_id)  (
        SELECT clips.id AS clip_id, demographics.id AS demographic_id
        FROM clips
        INNER JOIN demographics ON clips.client_id = demographics.client_id
      )
    `
  );
}
