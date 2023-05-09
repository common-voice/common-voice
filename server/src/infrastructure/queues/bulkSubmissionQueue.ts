import * as Queue from 'bull'
import { getConfig } from '../../config-helper'
import {
  bulkSubmissionImportProcessor,
  bulkSubmissionUploadProcessor,
} from './processors/bulkSubmissionProcessor'
import {
  BulkSubmissionImportJob,
  BulkSubmissionUploadJob,
} from './types/BulkSubmissionJob'
import { JobQueue } from './types/JobQueue'
import { task as T } from 'fp-ts'

const bulkSubmissionImportQueue = new Queue(
  'bulk-submission-import-queue',
  getConfig().REDIS_URL
)

const bulkSubmissionUploadQueue = new Queue(
  'bulk-submission-upload-queue',
  getConfig().REDIS_URL
)

bulkSubmissionImportQueue.process(bulkSubmissionImportProcessor)
bulkSubmissionUploadQueue.process(bulkSubmissionUploadProcessor)

export const addBulkSubmissionImportJob = (
  job: BulkSubmissionImportJob
): T.Task<boolean> => {
  bulkSubmissionImportQueue.add(job)
  return T.of(true)
}

export const addBulkSubmissionUploadJob = (
  job: BulkSubmissionUploadJob
): T.Task<boolean> => {
  return async () => {
    await bulkSubmissionUploadQueue.add(job)
    return true
  }
}

export const BulkSubmissionImportJobQueue: JobQueue<BulkSubmissionImportJob> = {
  addJob: addBulkSubmissionImportJob,
}

export const BulkSubmissionUploadJobQueue: JobQueue<BulkSubmissionUploadJob> = {
  addJob: addBulkSubmissionUploadJob,
}

bulkSubmissionUploadQueue.on('completed', (job, result) => {
  console.log(`Completed upload of ${job.data.filepath}`)
})
