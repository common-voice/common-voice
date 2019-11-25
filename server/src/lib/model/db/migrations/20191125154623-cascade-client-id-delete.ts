export const up = async function(db: any): Promise<any> {
  return db.runSql(`
    ALTER TABLE awards DROP FOREIGN KEY awards_ibfk_1;
    ALTER TABLE awards ADD CONSTRAINT awards_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;
    ALTER TABLE awards DROP FOREIGN KEY awards_ibfk_2;
    ALTER TABLE awards ADD CONSTRAINT awards_ibfk_2 FOREIGN KEY (custom_goal_id) REFERENCES custom_goals (id) ON DELETE CASCADE;

    ALTER TABLE clips DROP FOREIGN KEY clips_ibfk_2;
    ALTER TABLE clips ADD CONSTRAINT clips_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE custom_goals DROP FOREIGN KEY custom_goals_ibfk_1;
    ALTER TABLE custom_goals ADD CONSTRAINT custom_goals_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE earn DROP FOREIGN KEY earn_ibfk_2;
    ALTER TABLE earn ADD CONSTRAINT earn_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE enroll DROP FOREIGN KEY enroll_ibfk_1;
    ALTER TABLE enroll ADD CONSTRAINT enroll_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE reached_goals DROP FOREIGN KEY reached_goals_ibfk_1;
    ALTER TABLE reached_goals ADD CONSTRAINT reached_goals_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE reported_clips DROP FOREIGN KEY reported_clips_ibfk_1;
    ALTER TABLE reported_clips ADD CONSTRAINT reported_clips_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;
    ALTER TABLE reported_clips DROP FOREIGN KEY reported_clips_ibfk_2;
    ALTER TABLE reported_clips ADD CONSTRAINT reported_clips_ibfk_2 FOREIGN KEY (clip_id) REFERENCES clips (id) ON DELETE CASCADE;

    ALTER TABLE reported_sentences DROP FOREIGN KEY reported_sentences_ibfk_1;
    ALTER TABLE reported_sentences ADD CONSTRAINT reported_sentences_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE skipped_sentences DROP FOREIGN KEY skipped_sentences_ibfk_2;
    ALTER TABLE skipped_sentences ADD CONSTRAINT skipped_sentences_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE user_client_accents DROP FOREIGN KEY user_client_accents_ibfk_1;
    ALTER TABLE user_client_accents ADD CONSTRAINT user_client_accents_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE user_client_activities DROP FOREIGN KEY uca_ibfk_1;
    ALTER TABLE user_client_activities ADD CONSTRAINT uca_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE user_client_locale_buckets DROP FOREIGN KEY user_client_locale_buckets_ibfk_1;
    ALTER TABLE user_client_locale_buckets ADD CONSTRAINT user_client_locale_buckets_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE votes DROP FOREIGN KEY votes_ibfk_1;
    ALTER TABLE votes ADD CONSTRAINT votes_ibfk_1 FOREIGN KEY (clip_id) REFERENCES clips (id) ON DELETE CASCADE;
    ALTER TABLE votes DROP FOREIGN KEY votes_ibfk_2;
    ALTER TABLE votes ADD CONSTRAINT votes_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

  `);
};

export const down = function(): Promise<any> {
  return null;
};
