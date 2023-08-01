export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    UPDATE sentences
      JOIN (
        SELECT
          sentences.id,
          SUM(sentence_votes.vote) as number_of_approving_votes
        FROM sentences
        LEFT JOIN sentence_votes ON (sentence_votes.sentence_id=sentences.id)
        WHERE
          sentences.is_validated = FALSE
        GROUP BY sentences.id
        HAVING
          number_of_approving_votes >= 2
      ) as sentence_approvals
      ON sentences.id = sentence_approvals.id
    SET is_used=TRUE, is_validated=TRUE
    WHERE sentences.is_validated=FALSE
  `);
};

export const down = async function (): Promise<any> {
  return null;
};
