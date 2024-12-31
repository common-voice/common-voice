import { Job } from 'bull'
import { task as T, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { ValidateSentencesJob } from '../types/ValidateSentencesJob'
import { queryDb } from '../../db/mysql'
import { DatabaseQuery } from '../../db/types/database'
import { ResultSetHeader } from 'mysql2'

const updateValidatedSentencesQuery = `
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
`
const processValidatedSentences =
  (query: DatabaseQuery<unknown>) => (job: Job<ValidateSentencesJob>) => {
    console.log(`Processing ${job.data.name} job`)

    return pipe(
      query(updateValidatedSentencesQuery)([]),
      TE.map(([res, _]: [ResultSetHeader, unknown]) => console.log(`Updated ${res.changedRows} validated sentences`)),
      TE.getOrElse(err => T.of(console.log(err)))
    )()
  }

export default processValidatedSentences(queryDb)
