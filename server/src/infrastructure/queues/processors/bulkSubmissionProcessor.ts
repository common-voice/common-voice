import { Job } from 'bull'
import {
  BulkSubmissionImportJob,
  BulkSubmissionUploadJob,
} from '../types/BulkSubmissionJob'
import { task as T, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { doesBulkSubmissionExist, getBulkSubmissionFileUrl, uploadBulkSubmission } from '../../storage/storage'
import { sendBulkSubmissionNotificationEmail } from '../../email/email'
import { BulkSubmissionEmailData } from '../../../core/bulk-submissions/types/bulk-submission'
import { COMMON_VOICE_EMAIL } from 'common'

export const bulkSubmissionImportProcessor = async (
  job: Job<BulkSubmissionImportJob>
) => {
  // upload data with storage
}

export const processBulkSubmissionUpload =
  (upload: (path: string) => (data: Buffer) => TE.TaskEither<Error, void>) =>
  (doesExist: (path: string) => TE.TaskEither<Error, boolean>) =>
  (getDownloadUrl: (path: string) => string) =>
  (sendBulkSubmissionEmail: (data: BulkSubmissionEmailData) => TE.TaskEither<Error, boolean>) =>
  (job: Job<BulkSubmissionUploadJob>) => {
    return pipe(
      TE.Do,
      TE.bind('doesExist', () => doesExist(job.data.filepath)),
      TE.bind('uploadBulkSubmission', ({ doesExist }) => {
        return doesExist ? TE.right((()=>{return})()) : pipe(
          Buffer.from(job.data.data, 'hex'),
          upload(job.data.filepath)
        )}
      ),
      TE.let('downloadUrl', () => getDownloadUrl(job.data.filepath)),
      TE.bind('result', ({ downloadUrl }) => sendBulkSubmissionEmail({
        emailTo: COMMON_VOICE_EMAIL,
        filepath: downloadUrl,
        filename: job.data.filename,
        languageLocale: job.data.localeName
      })),
      TE.fold(
        (err) => T.of(console.log(err)),
        () => T.of((() => { return })())
      )
    )()
  }

export const bulkSubmissionUploadProcessor =
  processBulkSubmissionUpload(uploadBulkSubmission)(doesBulkSubmissionExist)(getBulkSubmissionFileUrl)(sendBulkSubmissionNotificationEmail)
