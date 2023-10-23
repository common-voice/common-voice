import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'

const storage =
  process.env.ENVIRONMENT === 'local'
    ? new Storage({
        apiEndpoint: process.env.CV_STORAGE_LOCAL_DEVELOPMENT_ENDPOINT,
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
        (err: unknown) => Error(String(err))
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
      (err: unknown) => Error(String(err))
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
      (err: unknown) => Error(String(err))
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
      (err: unknown) => Error(String(err))
    )
  }

export const streamUploadToBucket = streamUpload(storage)
export const uploadToBucket = upload(storage)
export const getMetadataFromFile = getMetadata(storage)
export const downloadFileFromBucket = downloadFile(storage)
