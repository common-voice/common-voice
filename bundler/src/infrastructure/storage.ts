import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'
import { getEnvironment, getStorageLocalEndpoint } from '../config/config'

export type Metadata = { size: string; crc32c: string }

const storage =
  getEnvironment() === 'local'
    ? new Storage({
        apiEndpoint: getStorageLocalEndpoint(),
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
          console.log(`Uploading ${path} to ${bucket}`)
          data
            .pipe(file.createWriteStream())
            .on('finish', () => {
              console.log(`Successfully uploaded ${path} to ${bucket}`)
              resolve()
            })
            .on('error', (err: Error) => {
              reject(err)
            })
        }),
      (err: unknown) => Error(String(err)),
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
      (err: unknown) => Error(String(err)),
    )
  }

const getMetadata =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, Metadata> => {
    return TE.tryCatch(
      async () => {
        const [metadata] = await storage.bucket(bucket).file(path).getMetadata()
        return metadata as Metadata
      },
      (err: unknown) => Error(String(err)),
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
      (err: unknown) => Error(String(err)),
    )
  }

const streamDownloadFile =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): Readable => {
    return storage.bucket(bucket).file(path).createReadStream()
  }

const fileExists =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, boolean> => {
    return TE.tryCatch(
      async () => {
        const [exists] = await storage.bucket(bucket).file(path).exists()
        return exists
      },
      (err: unknown) => Error(String(err)),
    )
  }

export const streamUploadToBucket = streamUpload(storage)
export const uploadToBucket = upload(storage)
export const getMetadataFromFile = getMetadata(storage)
export const downloadFileFromBucket = downloadFile(storage)
export const streamDownloadFileFromBucket = streamDownloadFile(storage)
export const doesFileExistInBucket = fileExists(storage)
