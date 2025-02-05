import OSS from 'ali-oss'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'
import { StatusCodes } from 'http-status-codes'
import { getConfig } from '../../config-helper'

const TWELVE_HOURS_IN_MS = 1000 * 60 * 60 * 12

const ossClient = new OSS({
  region: getConfig().ALI_OSS_REGION,
  accessKeyId: getConfig().ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: getConfig().ALI_OSS_ACCESS_KEY_SECRET,
  bucket: getConfig().ALI_OSS_BUCKET_NAME,
})

const streamUpload =
  (client: OSS) => (bucket: string) => (path: string) => (data: Readable) => {
    return TE.tryCatch(
      async () => {
        // Ensure 'data' is a Readable stream, then use 'putStream'
        await client.putStream(path, data, {
          headers: {
            'x-oss-object-acl': 'public-read',
          },
          timeout: 0,
          mime: '',
          meta: undefined,
          callback: undefined,
        })
      },
      err => err
    )
  }

const upload =
  (client: OSS) =>
  (bucket: string) =>
  (path: string) =>
  (data: Buffer | string | Readable) => {
    return TE.tryCatch(
      async () => {
        await client.put(path, data, {
          headers: {
            'x-oss-object-acl': 'public-read',
          },
        })
        console.log(`Successfully uploaded ${path}`)
      },
      err => err
    )
  }

const makePublic = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      await client.putACL(path, 'public-read')
    },
    err => err
  )
}

const getSignedUrl = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      return client.signatureUrl(path, { expires: TWELVE_HOURS_IN_MS / 1000 })
    },
    err => err
  )
}

const getPublicUrl = (client: OSS) => (bucket: string) => (path: string) => {
  return client.generateObjectUrl(path)
}

const deleteFile = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      await client.delete(path)
      console.log(`Successfully deleted ${path}`)
    },
    err => err
  )
}

const fileExists = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      const exists = await client.get(path)
      return !!exists
    },
    err => err
  )
}

const getMetadata = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      const metadata = await client.head(path)
      return metadata
    },
    err => err
  )
}

const downloadFile = (client: OSS) => (bucket: string) => (path: string) => {
  return TE.tryCatch(
    async () => {
      const result = await client.get(path)
      return result.content
    },
    err => err
  )
}

export const streamUploadToBucket = streamUpload(ossClient)
export const uploadToBucket = upload(ossClient)
export const doesFileExistInBucket = fileExists(ossClient)
export const makePublicInBucket = makePublic(ossClient)
export const getSignedUrlFromBucket = getSignedUrl(ossClient)
export const getPublicUrlFromBucket = getPublicUrl(ossClient)
export const getMetadataFromFile = getMetadata(ossClient)
export const deleteFileFromBucket = deleteFile(ossClient)
export const downloadFileFromBucket = downloadFile(ossClient)
