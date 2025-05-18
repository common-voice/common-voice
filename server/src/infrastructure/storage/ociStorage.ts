import * as oci from 'oci-sdk'
import { taskEither as TE } from 'fp-ts'
import { Readable } from 'stream'
import { StatusCodes } from 'http-status-codes'
import * as fs from 'fs'
import * as path from 'path'
import { getConfig } from '../../config-helper'

// Configuration Retrieval Function
const getociConfig = () => ({
  OCI_TENANCY_ID: getConfig().OCI_TENANCY_ID || '',
  OCI_USER_ID: getConfig().OCI_USER_ID || '',
  OCI_FINGERPRINT: getConfig().OCI_FINGERPRINT || '',
  OCI_PRIVATE_KEY_PATH: getConfig().OCI_PRIVATE_KEY_PATH || '',
  OCI_REGION: getConfig().OCI_REGION || '', // Use region ID instead of enum
  OCI_NAMESPACE: getConfig().OCI_NAMESPACE || '',
  OCI_BUCKET_NAME: getConfig().OCI_BUCKET_NAME || '',
})

// const getociConfig = () => ({
//   OCI_TENANCY_ID:
//     process.env.OCI_TENANCY_ID ||
//     'ocid1.tenancy.oc1..aaaaaaaaqoam3a3hqxcn3bkeo6vt7hjkvwq47nj2ejo3wlkcjo22o5bkcaja',
//   OCI_USER_ID:
//     process.env.OCI_USER_ID ||
//     'ocid1.user.oc1..aaaaaaaaywhojbfxpucwvhklq4664pvoyj6kwartn2g2do7ddnyjvogml3da',
//   OCI_FINGERPRINT:
//     process.env.OCI_FINGERPRINT ||
//     '8c:25:75:d9:f1:83:5e:c2:db:7b:be:6a:16:93:93:31',
//   OCI_PRIVATE_KEY_PATH: process.env.OCI_PRIVATE_KEY_PATH || '/host/orefay.pem',
//   OCI_REGION: process.env.OCI_REGION || 'me-jeddah-1', // Use region ID instead of enum
//   OCI_NAMESPACE: process.env.OCI_NAMESPACE || 'axzbw7rafu2r',
//   OCI_BUCKET_NAME: process.env.OCI_BUCKET_NAME || 'SiwarFalakBucket',
// })

// Load the private key
const loadPrivateKey = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    throw new Error(`Failed to load private key from file: ${err.message}`)
  }
}

// Ensure required configuration values are set
const config = getociConfig()
console.log('Configuration:', config)

const region = oci.common.Region.fromRegionId(config.OCI_REGION) // Use dynamic region handling

const {
  OCI_TENANCY_ID,
  OCI_USER_ID,
  OCI_FINGERPRINT,
  OCI_PRIVATE_KEY_PATH,
  OCI_NAMESPACE,
  OCI_BUCKET_NAME,
} = config

console.log('Configuration:', config)

const missingConfigs = []

if (!OCI_TENANCY_ID) missingConfigs.push(`OCI_TENANCY_ID: ${OCI_TENANCY_ID}`)
if (!OCI_USER_ID) missingConfigs.push(`OCI_USER_ID: ${OCI_USER_ID}`)
if (!OCI_FINGERPRINT) missingConfigs.push(`OCI_FINGERPRINT: ${OCI_FINGERPRINT}`)
if (!OCI_PRIVATE_KEY_PATH)
  missingConfigs.push(`OCI_PRIVATE_KEY_PATH: ${OCI_PRIVATE_KEY_PATH}`)
if (!region) missingConfigs.push(`OCI_REGION: ${config.OCI_REGION}`)
if (!OCI_NAMESPACE) missingConfigs.push(`OCI_NAMESPACE: ${OCI_NAMESPACE}`)
if (!OCI_BUCKET_NAME) missingConfigs.push(`OCI_BUCKET_NAME: ${OCI_BUCKET_NAME}`)

if (missingConfigs.length > 0) {
  throw new Error(
    `Missing required OCI configuration values: ${missingConfigs.join(', ')}`
  )
}

// Load the private key
const privateKey = loadPrivateKey(OCI_PRIVATE_KEY_PATH)

// OCI Configuration
const provider = new oci.common.SimpleAuthenticationDetailsProvider(
  OCI_TENANCY_ID,
  OCI_USER_ID,
  OCI_FINGERPRINT,
  privateKey,
  null, // passphrase (if any)
  region
)

// Enable debug logging
// oci.common.setLogLevel(oci.common.LogLevel.Debug)

// Initialize the Object Storage client
const objectStorageClient = new oci.objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
})

// // Test authentication by listing buckets
// const testAuthentication = async () => {
//   try {
//     const response = await objectStorageClient.listBuckets({
//       namespaceName: OCI_NAMESPACE,
//       compartmentId: OCI_TENANCY_ID,
//     })
//     console.log('Buckets:', response.items)
//   } catch (err) {
//     console.error('Authentication test failed:', err)
//   }
// }

// testAuthentication()
const getNamespace = async () => {
  try {
    const response = await objectStorageClient.getNamespace({})
    console.log('Hello Namespace:', response.value)
  } catch (err) {
    console.error('Failed to retrieve namespace:', err)
  }
}

getNamespace()

// Functions
const streamUpload =
  (bucket: string) =>
  (path: string) =>
  (data: Readable): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      () =>
        new Promise<void>((resolve, reject) => {
          const uploadDetails = {
            namespaceName: OCI_NAMESPACE,
            bucketName: bucket,
            objectName: path,
            putObjectBody: data,
          }
          console.log('Upload Details:', uploadDetails)

          objectStorageClient.putObject(uploadDetails).then(
            () => {
              console.log(`Successfully uploaded ${path}`)
              resolve()
            },
            (err: unknown) => {
              reject(new Error(`Failed to upload file: ${String(err)}`))
            }
          )
        }),
      (err: unknown) =>
        new Error(`Error occurred during stream upload: ${String(err)}`)
    )

const upload =
  (bucket: string) =>
  (path: string) =>
  (data: Buffer): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        const uploadDetails = {
          namespaceName: OCI_NAMESPACE,
          bucketName: bucket,
          objectName: path,
          putObjectBody: data,
        }
        await objectStorageClient.putObject(uploadDetails)
        console.log(`Successfully uploaded ${path}`)
      },
      (err: Error) => err
    )

const getSignedUrl =
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, string> =>
    TE.tryCatch(
      async () => {
        const url = `https://${OCI_NAMESPACE}.compat.objectstorage.${config.OCI_REGION}.oraclecloud.com/${bucket}/${path}`
        return url // OCI doesn't natively support signed URLs like GCS, this URL assumes public access
      },
      (err: Error) => err
    )

const deleteFile =
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        await objectStorageClient.deleteObject({
          namespaceName: OCI_NAMESPACE,
          bucketName: bucket,
          objectName: path,
        })
        console.log(`Successfully deleted ${path}`)
      },
      (err: Error) => err
    )

const fileExists =
  (bucket: string) =>
  (path: string): TE.TaskEither<Error, boolean> =>
    TE.tryCatch(
      async () => {
        try {
          await objectStorageClient.getObject({
            namespaceName: OCI_NAMESPACE,
            bucketName: bucket,
            objectName: path,
          })
          return true
        } catch (err) {
          if (err.statusCode === 404) return false
          throw err
        }
      },
      (err: Error) => err
    )

// Exports
export const streamUploadToBucket = streamUpload
export const uploadToBucket = upload
export const doesFileExistInBucket = fileExists
export const getSignedUrlFromBucket = getSignedUrl
export const deleteFileFromBucket = deleteFile
