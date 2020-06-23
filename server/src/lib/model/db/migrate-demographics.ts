import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function migrateDemographics() {
  await db.query(
    `
      INSERT INTO ages (age) VALUES (
        'teens',
        'twenties',
        'thirties',
        'fourties',
        'fifties',
        'sixties',
        'seventies',
        'eighties',
        'nineties'
      )

      /* Sex and gender exist across multiple spectra which are not adequately
         represented in our current database schema.

         Including demographic data with our dataset is necessary to ensure its
         utility to researchers, and helps us track the fullness and inclusion
         of our collection process. We will ALWAYS keep this field optional. We
         only store records for users who opt in, and will always (at very
         least) maintain an "Other" option.
      */
      INSERT INTO sexes (sex) VALUES ('female', 'male', 'other')

      /* FIXME: Only insert records with non-null demographics. */
      INSERT INTO demographics (client_id, age, sex)  (
        SELECT user_clients.client_id, ages.id, sexes.id
        FROM user_clients
        INNER JOIN ages ON ages.age = user_clients.deprecated_age
        INNER JOIN sexes ON sexes.sex = user_clients.deprecated_gender
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
