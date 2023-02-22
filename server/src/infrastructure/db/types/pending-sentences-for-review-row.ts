export type PendingSentencesForReviewRow = {
  id: number
  sentence: string
  source: string
  locale_id: number
  number_of_approving_votes: number
  number_of_votes: number
}
