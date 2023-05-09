import { AddBulkSubmissionCommand } from './command/add-bulk-submission-command'
import { createBulkSubmissionFilepath } from '../../../../core/bulk-submissions/bulk-submissions'
import { createMd5Hash } from '../../../../infrastructure/crypto/crypto'
import { BulkSubmissionUploadJobQueue } from '../../../../infrastructure/queues/bulkSubmissionQueue'
import { doesBulkSubmissionExist } from '../../services/bulk-submission-storage-service'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { createBulkSubmissionError } from '../../../helper/error-helper'
import { getLocaleIdF } from '../../../../lib/model/db'
import {
  BulkSubmissionImportStatusCreated,
  insertBulkSubmissionIntoDb,
} from '../../repository/bulk-submission-repository'

export const AddBulkSubmissionCommandHandler = (
  cmd: AddBulkSubmissionCommand
) => {
  return pipe(
    TE.Do,
    TE.bind('localeId', () => getLocaleIdF(cmd.locale)),
    TE.bind('filepath', () =>
      TE.right(
        createBulkSubmissionFilepath(cmd.locale, createMd5Hash(cmd.file))
      )
    ),
    TE.bind('doesExist', ({ filepath }) => doesBulkSubmissionExist(filepath)),
    TE.bind('uploadedSuccessfully', ({ filepath, doesExist }) =>
      doesExist
        ? TE.right(true)
        : TE.fromTask(
            BulkSubmissionUploadJobQueue.addJob({
              filepath,
              data: cmd.file,
            })
          )
    ),
    TE.bind('insertedSuccessfully', ({ filepath, localeId }) =>
      insertBulkSubmissionIntoDb({
        localeId: localeId,
        name: cmd.filename,
        size: cmd.size,
        path: filepath,
        submitter: cmd.submitter,
        importStatus: BulkSubmissionImportStatusCreated,
      })
    ),
    TE.mapLeft(err =>
      createBulkSubmissionError('Bulk submission upload failed', err)
    ),
    TE.map(
      ({ uploadedSuccessfully, insertedSuccessfully }) =>
        uploadedSuccessfully && insertedSuccessfully
    )
  )
}
