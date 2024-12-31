export type BulkSubmission = {
  sentence: string
  source: string
}

export type BulkSubmissionContactInformation = {
  email: string
}

export type BulkSubmissionEmailData = {
  emailTo: string
  filepath: string
  filename: string
  languageLocale: string
  contact: BulkSubmissionContactInformation
}
