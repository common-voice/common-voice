import { getConfig } from '../../../config-helper'
import { doesFileExistInBucket, uploadToBucket } from '../../../infrastructure/storage/storage'

const BUCKET_NAME = getConfig().BULK_SUBMISSION_BUCKET_NAME

export const uploadBulkSubmission = uploadToBucket(BUCKET_NAME)
export const doesBulkSubmissionExist = doesFileExistInBucket(BUCKET_NAME)
