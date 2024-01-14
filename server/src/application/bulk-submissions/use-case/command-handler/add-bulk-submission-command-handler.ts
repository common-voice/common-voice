import { AddBulkSubmissionCommand } from './command/add-bulk-submission-command'
import { createBulkSubmissionFilepath } from '../../../../core/bulk-submissions/bulk-submissions'
import { BulkSubmissionUploadJobQueue } from '../../../../infrastructure/queues/bulkSubmissionQueue'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { createBulkSubmissionError } from '../../../helper/error-helper'
import { getLocaleIdF } from '../../../../lib/model/db'
import {
  BulkSubmission,
  BulkSubmissionImportStatusCreated,
  insertBulkSubmissionIntoDb,
} from '../../repository/bulk-submission-repository'
import { JobQueue } from '../../../../infrastructure/queues/types/JobQueue'
import { BulkSubmissionUploadJob } from '../../../../infrastructure/queues/types/BulkSubmissionJob'
import { fetchUserClientEmailById } from '../../repository/user-client-repository'

export const addBulkSubmission =
  (getLocaleId: (a: string) => TE.TaskEither<Error, number>) =>
  (fetchClientEmail: (id: string) => TE.TaskEither<Error, string>) =>
  (createBulkSubmissionFilepath: (locale: string, data: string) => string) =>
  (jobQueue: JobQueue<BulkSubmissionUploadJob>) =>
  (insertIntoDb: (a: BulkSubmission) => TE.TaskEither<Error, boolean>) =>
  (cmd: AddBulkSubmissionCommand) => {
    return pipe(
      TE.Do,
      TE.let('filepath', () =>
        createBulkSubmissionFilepath(cmd.locale, cmd.file)
      ),
      TE.bind('localeId', () => getLocaleId(cmd.locale)),
      TE.bind('userClientEmail', () => fetchClientEmail(cmd.submitter)),
      TE.bind('addToQueue', ({ filepath, userClientEmail }) =>
        TE.fromTask(
          jobQueue.addJob({
            filepath,
            filename: cmd.filename,
            localeName: cmd.locale,
            data: cmd.file,
            userClientEmail: userClientEmail,
          })
        )
      ),
      TE.bind('insertIntoDb', ({ filepath, localeId }) =>
        insertIntoDb({
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
      TE.map(({ addToQueue, insertIntoDb }) => addToQueue && insertIntoDb)
    )
  }

export const addBulkSubmissionCommandHandler = 
  addBulkSubmission
    (getLocaleIdF)
    (fetchUserClientEmailById)
    (createBulkSubmissionFilepath)
    (BulkSubmissionUploadJobQueue)
    (insertBulkSubmissionIntoDb)
