export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    ALTER TABLE achievements ADD COLUMN week SMALLINT DEFAULT NULL;

    UPDATE achievements SET week = 1 WHERE name LIKE 'challenge_engagement_rank%' LIMIT 3;
    UPDATE achievements SET week = 2 WHERE name like 'challenge_social_rank%' LIMIT 3;
    UPDATE achievements SET week = 3 WHERE name LIKE 'challenge_validated_rank%'
        OR name LIKE 'challenge_contributed_rank%' LIMIT 6;
  `);
};

export const down = function (): Promise<any> {
  return null;
};
