import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { getConfig } from '../../config-helper'

const BUCKET_NAME = getConfig().BULK_SUBMISSION_BUCKET_NAME

const storage =
  getConfig().ENVIRONMENT === 'local'
    ? new Storage({
        apiEndpoint: getConfig().STORAGE_LOCAL_DEVELOPMENT_ENDPOINT,
        projectId: 'local',
        useAuthWithCustomEndpoint: false,
      })
    : new Storage()

export const upload =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string) =>
  (data: Buffer): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        const file = storage.bucket(bucket).file(path)
        await file.save(data)
        await file.makePublic()
      },
      (err: Error) => err
    )
  }

export const getPublicUrl =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): string =>
    storage.bucket(bucket).file(path).publicUrl()

export const fileExists =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, boolean> => {
    return TE.tryCatch(
      async () => {
        const [exists] = await storage.bucket(bucket).file(path).exists()
        return exists
      },
      (err: Error) => err
    )
  }

export const uploadBulkSubmission = upload(storage)(BUCKET_NAME)
export const doesBulkSubmissionExist = fileExists(storage)(BUCKET_NAME)
export const getBulkSubmissionFileUrl = getPublicUrl(storage)(BUCKET_NAME)
