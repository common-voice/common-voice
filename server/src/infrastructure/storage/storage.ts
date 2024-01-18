import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { getConfig } from '../../config-helper'
import { Readable } from 'stream'
import { StatusCodes } from 'http-status-codes'

const TWELVE_HOURS_IN_MS = 1000 * 60 * 60 * 12

export type Metadata = {
  size: number
}

const storage =
  getConfig().ENVIRONMENT === 'local'
    ? new Storage({
        apiEndpoint: getConfig().STORAGE_LOCAL_DEVELOPMENT_ENDPOINT,
        projectId: 'local',
        useAuthWithCustomEndpoint: false,
      })
    : new Storage()

const streamUpload =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string) =>
  (data: Readable): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      () =>
        new Promise<void>((resolve, reject) => {
          const file = storage.bucket(bucket).file(path)
          data
            .pipe(file.createWriteStream())
            .on('finish', () => {
              console.log(`Successfully uploaded ${path}`)
              resolve()
            })
            .on('error', (err: Error) => {
              reject(err)
            })
        }),
      (err: Error) => err
    )
  }

const upload =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string) =>
  (data: Buffer): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        const file = storage.bucket(bucket).file(path)
        await file.save(data)
        console.log(`Successfully uploaded ${path}`)
      },
      (err: Error) => err
    )
  }

const makePublic =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        await storage.bucket(bucket).file(path).makePublic()
      },
      (err: Error) => err
    )

const getSignedUrl =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, string> =>
    TE.tryCatch(
      async () => {
        const [url] = await storage
          .bucket(bucket)
          .file(path)
          .getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + TWELVE_HOURS_IN_MS,
          })
        return url
      },
      (err: Error) => err
    )

const getPublicUrl =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): string =>
    storage.bucket(bucket).file(path).publicUrl()

const deleteFile =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        const [result] = await storage.bucket(bucket).file(path).delete()

        if (result.statusCode !== StatusCodes.OK)
          throw new Error(`Error deleting ${path}`)
      },
      (err: Error) => err
    )

const fileExists =
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

const getMetadata =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, Metadata> => {
    return TE.tryCatch(
      async () => {
        const [metadata] = await storage.bucket(bucket).file(path).getMetadata()
        
        return {
          size: Number(metadata.size)
        }
      },
      (err: Error) => err
    )
  }

const downloadFile =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, Buffer> => {
    return TE.tryCatch(
      async () => {
        const [buffer] = await storage.bucket(bucket).file(path).download()
        return buffer
      },
      (err: Error) => err
    )
  }

export const streamUploadToBucket = streamUpload(storage)
export const uploadToBucket = upload(storage)
export const doesFileExistInBucket = fileExists(storage)
export const makePublicInBucket = makePublic(storage)
export const getSignedUrlFromBucket = getSignedUrl(storage)
export const getPublicUrlFromBucket = getPublicUrl(storage)
export const getMetadataFromFile = getMetadata(storage)
export const deleteFileFromBucket = deleteFile(storage)
export const downloadFileFromBucket = downloadFile(storage)
