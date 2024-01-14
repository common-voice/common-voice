import { StatusCodes } from 'http-status-codes'
import { handler } from '../../../../api/bulk-submissions/handler/add-bulk-submission-handler'
import { AddBulkSubmissionCommand } from '../../../../application/bulk-submissions/use-case/command-handler/command/add-bulk-submission-command'
import { taskEither as TE } from 'fp-ts'
import { createBulkSubmissionError } from '../../../../application/helper/error-helper'
import { BulkSubmissionErrorKind } from '../../../../application/types/error'

describe('AddBulkSubmissionHandler', () => {
  const addBulkSubmissionHandler = handler(
    jest.fn((cmd: AddBulkSubmissionCommand) => TE.right(true))
  )

  it('should return bad request 400 with file too large message', async () => {
    const reqMock: any = {
      client_id: 'abc',
      headers: {
        'content-length': 26 * 1024 * 1024,
      },
      params: {
        locale: 'en',
      },
    }
    const resMock: any = {}
    resMock.status = jest.fn().mockReturnValue(resMock)
    resMock.json = jest.fn().mockReturnValue(resMock)

    await addBulkSubmissionHandler(reqMock, resMock)
    expect(resMock.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'file is larger than 25MB',
    })
  })

  it('should return bad request 400 when client_id is not present', async () => {
    const reqMock: any = {
      headers: {
        'content-length': 100,
      },
      params: {
        locale: 'en',
      },
    }
    const resMock: any = {}
    resMock.status = jest.fn().mockReturnValue(resMock)
    resMock.json = jest.fn().mockReturnValue(resMock)

    await addBulkSubmissionHandler(reqMock, resMock)
    expect(resMock.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'no client id',
    })
  })

  it('should return bad request 400 when content-length and filesize are not matching', async () => {
    const contentLengthSize = 1024
    const realFileSize = 26 * 1024 * 1024

    const reqMock: any = {
      client_id: 'abc',
      headers: {
        'content-length': contentLengthSize,
      },
      params: {
        locale: 'en',
      },
    }

    reqMock[Symbol.iterator] = function*() {
      yield Buffer.alloc(realFileSize, 'a')
    }

    const resMock: any = {}
    resMock.status = jest.fn().mockReturnValue(resMock)
    resMock.json = jest.fn().mockReturnValue(resMock)

    await addBulkSubmissionHandler(reqMock, resMock)
    expect(resMock.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'file size is not matching content-length',
    })
  })

  it('should return OK 200 when all data is provided', async () => {
    const contentLengthSize = 1024
    const realFileSize = 1024

    const reqMock: any = {
      client_id: 'abc',
      headers: {
        'content-length': contentLengthSize,
      },
      params: {
        locale: 'en',
      },
    }

    reqMock[Symbol.iterator] = function*() {
      yield Buffer.alloc(realFileSize, 'a')
    }

    const resMock: any = {}
    resMock.status = jest.fn().mockReturnValue(resMock)
    resMock.json = jest.fn().mockReturnValue(resMock)

    await addBulkSubmissionHandler(reqMock, resMock)
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Bulk submission added',
    })
  })

  it('should return internal server errror 500 when application error is returned', async () => {
    const errMsg = 'Oops'
    const addBulkSubmissionHandler = handler(
      jest.fn((cmd: AddBulkSubmissionCommand) => TE.left(createBulkSubmissionError(errMsg)))
    )

    const contentLengthSize = 1024
    const realFileSize = 1024

    const reqMock: any = {
      client_id: 'abc',
      headers: {
        'content-length': contentLengthSize,
      },
      params: {
        locale: 'en',
      },
    }

    reqMock[Symbol.iterator] = function*() {
      yield Buffer.alloc(realFileSize, 'a')
    }

    const resMock: any = {}
    resMock.status = jest.fn().mockReturnValue(resMock)
    resMock.json = jest.fn().mockReturnValue(resMock)

    await addBulkSubmissionHandler(reqMock, resMock)

    expect(resMock.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resMock.json).toHaveBeenCalledWith({
      message: errMsg,
      kind: BulkSubmissionErrorKind
    })
  })
})
