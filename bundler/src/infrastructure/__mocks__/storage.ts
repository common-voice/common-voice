// Manual Jest mock for infrastructure/storage.
// Usage: jest.mock('../infrastructure/storage')
//
// Prevents GCS client from being instantiated during tests.

const mockUploadTE = jest.fn(async () => ({ _tag: 'Right' as const, right: undefined }))

export const uploadToBucket = jest.fn(() => jest.fn(() => jest.fn(() => mockUploadTE)))
export const streamUploadToBucket = jest.fn(() => jest.fn(() => jest.fn(() => mockUploadTE)))
export const getMetadataFromFile = jest.fn()
export const downloadFileFromBucket = jest.fn()
export const streamDownloadFileFromBucket = jest.fn()
export const doesFileExistInBucket = jest.fn()
