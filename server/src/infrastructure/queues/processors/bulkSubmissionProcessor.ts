import { Job } from 'bull'
import {
  BulkSubmissionImportJob,
  BulkSubmissionUploadJob,
} from '../types/BulkSubmissionJob'
import { task as T, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import {
  doesFileExistInBucket,
  getPublicUrlFromBucket,
  makePublicInBucket,
  uploadToBucket,
} from '../../storage/storage'
import { sendBulkSubmissionNotificationEmail } from '../../email/email'
import { BulkSubmissionEmailData } from '../../../core/bulk-submissions/types/bulk-submission'
import { COMMON_VOICE_EMAIL } from 'common'
import { getConfig } from '../../../config-helper'

const BULK_SUBMISSION_BUCKET = getConfig().BULK_SUBMISSION_BUCKET_NAME

export const bulkSubmissionImportProcessor = async (
  job: Job<BulkSubmissionImportJob>
) => {
  // import data from storage
}

export const processBulkSubmissionUpload =
  (upload: (path: string) => (data: Buffer) => TE.TaskEither<Error, void>) =>
  (doesExist: (path: string) => TE.TaskEither<Error, boolean>) =>
  (makePublic: (path: string) => TE.TaskEither<Error, void>) =>
  (getDownloadUrl: (path: string) => string) =>
  (
    sendBulkSubmissionEmail: (
      data: BulkSubmissionEmailData
    ) => TE.TaskEither<Error, boolean>
  ) =>
  (job: Job<BulkSubmissionUploadJob>) => {
    console.log(`Starting to process ${job.data.filename}`)
    return pipe(
      TE.Do,
      TE.bind('doesExist', () => doesExist(job.data.filepath)),
      TE.bind('uploadBulkSubmission', ({ doesExist }) => {
        return doesExist
          ? TE.right(constVoid())
          : pipe(
              TE.sequenceSeqArray([
                pipe(
                  Buffer.from(job.data.data, 'hex'),
                  upload(job.data.filepath)
                ),
                makePublic(job.data.filepath),
              ]),
              TE.map(() => constVoid())
            )
      }),
      TE.let('downloadUrl', () => getDownloadUrl(job.data.filepath)),
      TE.bind('result', ({ downloadUrl }) =>
        sendBulkSubmissionEmail({
          emailTo: COMMON_VOICE_EMAIL,
          filepath: downloadUrl,
          filename: job.data.filename,
          languageLocale: job.data.localeName,
          contact: {
            email: job.data.userClientEmail
          }
        })
      ),
      TE.fold(
        err => T.of(console.log(err)),
        () => T.of(constVoid())
      )
    )()
  }

export const bulkSubmissionUploadProcessor = 
  processBulkSubmissionUpload
    (uploadToBucket(BULK_SUBMISSION_BUCKET))
    (doesFileExistInBucket(BULK_SUBMISSION_BUCKET))
    (makePublicInBucket(BULK_SUBMISSION_BUCKET))
    (getPublicUrlFromBucket(BULK_SUBMISSION_BUCKET))
    (sendBulkSubmissionNotificationEmail)
