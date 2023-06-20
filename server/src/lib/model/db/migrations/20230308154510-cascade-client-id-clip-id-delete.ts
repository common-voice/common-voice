export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    ALTER TABLE skipped_clips DROP FOREIGN KEY skipped_clips_ibfk_2;
    ALTER TABLE skipped_clips ADD CONSTRAINT skipped_clips_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE;

    ALTER TABLE skipped_clips DROP FOREIGN KEY skipped_clips_ibfk_1;
    ALTER TABLE skipped_clips ADD CONSTRAINT skipped_clips_ibfk_1 FOREIGN KEY (clip_id) REFERENCES clips (id) ON DELETE CASCADE;

    ALTER TABLE clip_demographics DROP FOREIGN KEY clip_demographics_ibfk_1;
    ALTER TABLE clip_demographics ADD CONSTRAINT clip_demographics_ibfk_1 FOREIGN KEY (clip_id) REFERENCES clips (id) ON DELETE CASCADE;

    ALTER TABLE clip_demographics DROP FOREIGN KEY clip_demographics_ibfk_2;
    ALTER TABLE clip_demographics ADD CONSTRAINT clip_demographics_ibfk_2 FOREIGN KEY (demographic_id) REFERENCES demographics (id) ON DELETE CASCADE;
  `);
};

export const down = function (): Promise<any> {
  return null;
};
