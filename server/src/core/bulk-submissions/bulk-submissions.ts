import { createMd5Hash } from '../crypto/crypto'

export const createBulkSubmissionFilepath = (
  locale: string,
  data: string
): string => `${locale}/bulk_submission_${createMd5Hash(data)}.tsv`
