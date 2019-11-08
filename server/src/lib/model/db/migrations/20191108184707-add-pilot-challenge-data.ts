// Our current version of MySQL doesn't support `WITH` statements. We're only
// running this a few times, so no need to get fancy. It'll get cached anyway.
const pilotId = `(SELECT id FROM challenges WHERE url_token='pilot')`;

export const up = async function(db: any): Promise<any> {
  return db.runSql(`
    /* We're handling logos on the front-end. */
    ALTER TABLE teams DROP COLUMN logo_url;
    ALTER TABLE achievements DROP COLUMN image_url;

    /* Insert seed data for the 2019 Pilot Challenge. */
    INSERT INTO challenges (url_token, name, start_date)
    VALUES ('pilot', '2019 Pilot', '2019-11-18');

    INSERT INTO teams (url_token, name, challenge_id)
    VALUES
      ('ibm', 'IBM', ${pilotId}),
      ('mozilla', 'Mozilla', ${pilotId}),
      ('sap', 'SAP', ${pilotId});

    INSERT INTO achievements (name, points, challenge_id)
    VALUES
      ('sign_up_first_three_days', 50, ${pilotId}),
      ('first_contribution', 50, ${pilotId}),
      ('challenge_engagement_rank_1', 100, ${pilotId}),
      ('challenge_engagement_rank_2', 80, ${pilotId}),
      ('challenge_engagement_rank_3', 60, ${pilotId}),
      ('invite_signup', 50, ${pilotId}),
      ('invite_send', 50, ${pilotId}),
      ('invite_contribute_same_session', 50, ${pilotId}),
      ('challenge_social_rank_1', 100, ${pilotId}),
      ('challenge_social_rank_2', 80, ${pilotId}),
      ('challenge_social_rank_3', 60, ${pilotId}),
      ('three_day_streak', 50, ${pilotId}),
      ('challenge_validated_rank_1', 100, ${pilotId}),
      ('challenge_validated_rank_2', 80, ${pilotId}),
      ('challenge_validated_rank_3', 60, ${pilotId}),
      ('challenge_contributed_rank_1', 100, ${pilotId}),
      ('challenge_contributed_rank_2', 80, ${pilotId}),
      ('challenge_contributed_rank_3', 60, ${pilotId}),
      ('progress_survey', 50, ${pilotId});
  `);
};

export const down = function(): Promise<any> {
  return null;
};
