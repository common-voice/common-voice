export const createBulkSubmissionFilepath = (locale: string, md5Hash: string): string =>
  `${locale}/bulk_submission_${md5Hash}.tsv`
