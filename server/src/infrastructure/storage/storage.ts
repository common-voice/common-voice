import { Storage } from '@google-cloud/storage'
import { getConfig } from '../../config-helper'
import { taskEither as TE } from 'fp-ts'
import { bool } from 'aws-sdk/clients/signer'

const BUCKET_NAME = getConfig().BULK_SUBMISSION_BUCKET_NAME
const storage = new Storage({ credentials: getConfig().GCP_CREDENTIALS })

export const upload =
  (storage: Storage) =>
  (bucket: string) =>
  (path: string) =>
  (data: Buffer): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      () => storage.bucket(bucket).file(path).save(data),
      (err: Error) => err
    )
  }

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
