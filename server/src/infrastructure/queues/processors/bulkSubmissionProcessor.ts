import { Job } from 'bull'
import {
  BulkSubmissionImportJob,
  BulkSubmissionUploadJob,
} from '../types/BulkSubmissionJob'
import { task as T, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { doesBulkSubmissionExist, uploadBulkSubmission } from '../../storage/storage'

export const bulkSubmissionImportProcessor = async (
  job: Job<BulkSubmissionImportJob>
) => {
  // upload data with storage
}

export const processBulkSubmissionUpload =
  (upload: (path: string) => (data: Buffer) => TE.TaskEither<Error, void>) =>
  (doesExist: (path: string) => TE.TaskEither<Error, boolean>) =>
  (job: Job<BulkSubmissionUploadJob>) => {
    const uploadBulkSubmission = pipe(
      Buffer.from(job.data.data, 'hex'),
      upload(job.data.filepath)
    )

    return pipe(
      TE.Do,
      TE.bind('doesExist', () => doesExist(job.data.filepath)),
      TE.chain(({ doesExist }) =>
        doesExist ? TE.right((()=>{return})()) : uploadBulkSubmission
      ),
      TE.getOrElse((err) => T.of(console.log(err)))
    )()
  }

export const bulkSubmissionUploadProcessor =
  processBulkSubmissionUpload(uploadBulkSubmission)(doesBulkSubmissionExist)
