import { processBulkSubmissionUpload } from '../../../../infrastructure/queues/processors/bulkSubmissionProcessor'
import { task as T, taskEither as TE } from 'fp-ts'
import { constVoid } from 'fp-ts/function'
import { BulkSubmissionUploadJob } from '../../../../infrastructure/queues/types/BulkSubmissionJob'
import { Job } from 'bull'

describe('Bulk Submission Processor', () => {
  it('Should send an email when file is uploaded', async () => {
    const uploadMock = jest.fn(
      (a: string) => (data: Buffer) => TE.right(constVoid())
    )
    const doesExistMock = jest.fn(() => TE.right(false))
    const makePublic = jest.fn(() => TE.right(constVoid()))
    const getDownloadUrlMock = jest.fn(
      () => 'http://some.domain.com/fileurl.tsv'
    )
    const sendBulkSubmissionEmailMock = jest.fn(() => TE.right(true))

    const job = {
      data: {
        data: 'abcdef',
        filepath: 'filename.tsv',
        filename: 'displayName.tsv',
        localeName: 'en',
      },
    } as Job<BulkSubmissionUploadJob>

    const sut = processBulkSubmissionUpload(uploadMock)(doesExistMock)(makePublic)(
      getDownloadUrlMock
    )(sendBulkSubmissionEmailMock)

    await sut(job)

    expect(uploadMock).toHaveBeenCalled()
    expect(doesExistMock).toHaveBeenCalled()
    expect(getDownloadUrlMock).toHaveBeenCalled()
    expect(sendBulkSubmissionEmailMock).toHaveBeenCalled()
  })

  it('Should not upload file if same file does already exist', async () => {
    const uploadMock = jest.fn(
      (a: string) => (data: Buffer) => TE.of(constVoid())
    )
    const doesExistMock = jest.fn(() => TE.right(true))
    const makePublic = jest.fn(() => TE.right(constVoid()))
    const getDownloadUrlMock = jest.fn(
      () => 'http://some.domain.com/fileurl.tsv'
    )
    const sendBulkSubmissionEmailMock = jest.fn(() => TE.right(true))

    const job = {
      data: {
        data: 'abcdef',
        filepath: 'filename.tsv',
        filename: 'displayName.tsv',
        localeName: 'en',
      },
    } as Job<BulkSubmissionUploadJob>

    const sut = processBulkSubmissionUpload(uploadMock)(doesExistMock)(makePublic)(
      getDownloadUrlMock
    )(sendBulkSubmissionEmailMock)

    await sut(job)

    expect(uploadMock).not.toHaveBeenCalled()
    expect(doesExistMock).toHaveBeenCalled()
    expect(getDownloadUrlMock).toHaveBeenCalled()
    expect(sendBulkSubmissionEmailMock).toHaveBeenCalled()
  })

  it('Should not send email if uploading bulk submission failed', async () => {
    const uploadMock = jest.fn(
      (a: string) => (data: Buffer) => TE.left(Error('oops'))
    )
    const doesExistMock = jest.fn(() => TE.right(false))
    const makePublic = jest.fn(() => TE.right(constVoid()))
    const getDownloadUrlMock = jest.fn(
      () => 'http://some.domain.com/fileurl.tsv'
    )
    const sendBulkSubmissionEmailMock = jest.fn(() => TE.right(true))

    const job = {
      data: {
        data: 'abcdef',
        filepath: 'filename.tsv',
        filename: 'displayName.tsv',
        localeName: 'en',
      },
    } as Job<BulkSubmissionUploadJob>

    const sut = processBulkSubmissionUpload(uploadMock)(doesExistMock)(makePublic)(
      getDownloadUrlMock
    )(sendBulkSubmissionEmailMock)

    await sut(job)

    expect(doesExistMock).toHaveBeenCalled()
    expect(uploadMock).toHaveBeenCalled()
    expect(getDownloadUrlMock).not.toHaveBeenCalled()
    expect(sendBulkSubmissionEmailMock).not.toHaveBeenCalled()
  })
})
