import { Job } from 'bull'
import {
  BulkSubmissionImportJob,
  BulkSubmissionUploadJob,
} from '../types/BulkSubmissionJob'
import { task as T, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { uploadBulkSubmission } from '../../../application/bulk-submissions/services/bulk-submission-storage-service'

export const bulkSubmissionImportProcessor = async (
  job: Job<BulkSubmissionImportJob>
) => {
  // upload data with storage
}

export const processBulkSubmissionUpload =
  (
    uploadBulkSubmission: (
      path: string
    ) => (data: Buffer) => TE.TaskEither<Error, void>
  ) =>
  async (job: Job<BulkSubmissionUploadJob>) => {
    await pipe(
      Buffer.from(job.data.data, 'hex'),
      uploadBulkSubmission(job.data.filepath),
      TE.getOrElse((err) => T.of(console.log(err)))
    )()
  }

export const bulkSubmissionUploadProcessor = processBulkSubmissionUpload(uploadBulkSubmission)