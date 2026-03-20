import { Storage } from '@google-cloud/storage'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'
import { getEnvironment, getStorageLocalEndpoint } from '../config'
import { logger } from './logger'

export type Metadata = { size: string; crc32c: string }

// Resumable uploads chunk data and wait for an HTTP ack per chunk.
// The default (~5 MB) causes ~19,000 round-trips for a 95 GB tarball,
// limiting throughput to ~5 MB/s regardless of network bandwidth.
// 32 MB matches gsutil's default and cuts round-trips to ~3,000.
// For files smaller than chunkSize the library sends a single chunk.
const UPLOAD_CHUNK_SIZE = 32 * 1024 * 1024 // 32 MB

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
          const shortPath = path.includes('/') ? path.substring(path.indexOf('/') + 1) : path
          const uploadStart = Date.now()
          logger.info('STORAGE', `Uploading ${shortPath}`)

          // Listen for errors on the source stream so tar/metrics failures
          // reject the promise instead of hanging silently.
          data.on('error', (err: Error) => reject(err))

          data
            .pipe(file.createWriteStream({
              resumable: true,
              chunkSize: UPLOAD_CHUNK_SIZE,
            }))
            .on('finish', () => {
              const elapsed = ((Date.now() - uploadStart) / 1000).toFixed(1)
              logger.info('STORAGE', `Uploaded ${shortPath} (${elapsed}s)`)
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
        const shortPath = path.includes('/') ? path.substring(path.indexOf('/') + 1) : path
        logger.info('STORAGE', `Uploaded ${shortPath}`)
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
