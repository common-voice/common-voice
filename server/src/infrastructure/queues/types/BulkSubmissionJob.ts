// This job represents a bulk submission that contains sentences,
// which have to be imported into our sentences corpus
export type BulkSubmissionImportJob = {
  filepath: string
}

// This job represents a bulk submission file that contains sentences,
// that needs to be uploaded
export type BulkSubmissionUploadJob = {
  data: string
  filepath: string
  filename: string
  localeName: string
  userClientEmail: string
}
