import { Storage } from '@google-cloud/storage'
import { getConfig } from '../../../config-helper'
import { fileExists, upload } from '../../../infrastructure/storage/storage'

const BUCKET_NAME = getConfig().BULK_SUBMISSION_BUCKET_NAME
const storage = new Storage({ credentials: getConfig().GCP_CREDENTIALS })

export const uploadBulkSubmission = upload(storage)(BUCKET_NAME)
export const doesBulkSubmissionExist = fileExists(storage)(BUCKET_NAME)