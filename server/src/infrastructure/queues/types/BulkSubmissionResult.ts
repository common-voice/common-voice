export type BulkSubmissionJobResult = BulkSubmissionJobFailure | BulkSubmissionJobSuccess

export type BulkSubmissionJobFailure = {
  kind: 'failure'
  reason: string
}

export type BulkSubmissionJobSuccess = {
  kind: 'success'
}
