import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'
import { getEnvironment, getStorageLocalEndpoint } from '../config/config'

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
  (path: string): TE.TaskEither<Error, any> => {
    return TE.tryCatch(
      async () => {
        const [metadata] = await storage.bucket(bucket).file(path).getMetadata()
        return metadata
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
    return  storage.bucket(bucket).file(path).createReadStream()
  }

export const streamUploadToBucket = streamUpload(storage)
export const uploadToBucket = upload(storage)
export const getMetadataFromFile = getMetadata(storage)
export const downloadFileFromBucket = downloadFile(storage)
export const streamDownloadFileFromBucket = streamDownloadFile(storage)
