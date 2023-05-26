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
import { Job } from 'bull'
import { BulkSubmissionJobResult } from './types/BulkSubmissionResult'

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
    console.log(`Bulk submission job ${job.filename} added to queue`)
    return true
  }
}

export const BulkSubmissionImportJobQueue: JobQueue<BulkSubmissionImportJob> = {
  addJob: addBulkSubmissionImportJob,
}

export const BulkSubmissionUploadJobQueue: JobQueue<BulkSubmissionUploadJob> = {
  addJob: addBulkSubmissionUploadJob,
}

bulkSubmissionUploadQueue.on(
  'completed',
  (job: Job<BulkSubmissionUploadJob>, result: BulkSubmissionJobResult) => {
    switch (result.kind) {
      case 'success':
        console.log(
          `Bulk submission uploaded successfully as ${job.data.filepath}`
        )
        break
      case 'failure':
        console.log(
          `Bulk submission upload for ${job.data.filename} failed: ${result.reason}`
        )
        break
    }
  }
)

bulkSubmissionUploadQueue.on('error', console.error)
bulkSubmissionUploadQueue.on('failed', console.error)
