import { addBulkSubmission } from '../../../../../application/bulk-submissions/use-case/command-handler/add-bulk-submission-command-handler'
import { task as T, taskEither as TE } from 'fp-ts'
import { JobQueue } from '../../../../../infrastructure/queues/types/JobQueue'
import { BulkSubmissionUploadJob } from '../../../../../infrastructure/queues/types/BulkSubmissionJob'
import { createBulkSubmissionFilepath } from '../../../../../core/bulk-submissions/bulk-submissions'
import { ApplicationError } from '../../../../../application/types/error'

describe('Bulk submission command handler', () => {
  it('should add upload job to the queue', async () => {
    const getLocaleIdStub = () => TE.right(2)
    const insertIntoDbMock = jest.fn(
      (): TE.TaskEither<Error, boolean> => TE.right(true)
    )
    const addJobMock = jest.fn(() => () => Promise.resolve(true))
    const jobQueueStub: JobQueue<BulkSubmissionUploadJob> = {
      addJob: addJobMock,
    }

    const cmd = {
      submitter: 'clientId',
      filename: 'string',
      locale: 'en',
      file: 'abcdefg',
      size: 56,
    }

    const sut = addBulkSubmission(getLocaleIdStub)(
      createBulkSubmissionFilepath
    )(jobQueueStub)(insertIntoDbMock)

    const result = await TE.getOrElse(() => {
      throw new Error('Should not throw')
    })(sut(cmd))()

    expect(addJobMock.mock.calls).toHaveLength(1)
    expect(insertIntoDbMock.mock.calls).toHaveLength(1)
    expect(result).toBe(true)
  })

  it('should not add upload job to the queue and not trigger db insert when we cannot retrieve the locale id', async () => {
    const insertIntoDbMock = jest.fn(
      (): TE.TaskEither<Error, boolean> => TE.right(true)
    )
    const getErrorLocaleIdStub = () =>
      TE.left(new Error('something went wrong'))
    const addJobMock = jest.fn(() => () => Promise.resolve(true))
    const jobQueueStub: JobQueue<BulkSubmissionUploadJob> = {
      addJob: addJobMock,
    }

    const cmd = {
      submitter: 'clientId',
      filename: 'string',
      locale: 'en',
      file: 'abcdefg',
      size: 56,
    }

    const sut = addBulkSubmission(getErrorLocaleIdStub)(
      createBulkSubmissionFilepath
    )(jobQueueStub)(insertIntoDbMock)

    const result = await TE.getOrElse(err => T.of(err))(sut(cmd))() as ApplicationError

    expect(addJobMock.mock.calls).toHaveLength(0)
    expect(insertIntoDbMock.mock.calls).toHaveLength(0)
    expect(result.message).toBe('Bulk submission upload failed')
  })
})
