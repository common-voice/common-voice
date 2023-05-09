import { taskEither as TE } from 'fp-ts'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { clientId } from '../../../core/types/clientId'

const db = getMySQLInstance()

export type BulkSubmission = {
  localeId: number
  size: number
  path: string
  name: string
  submitter: clientId
  importStatus: BulkSubmissionImportStatus
}

export const BulkSubmissionImportStatusCreated = 'created'
export const BulkSubmissionImportStatusRunning = 'running'
export const BulkSubmissionImportStatusSuccess = 'success'
export const BulkSubmissionImportStatusWarning = 'warning'
export const BulkSubmissionImportStatusFailed = 'failed'

const BulkSubmissionImportStatusValue = [
  BulkSubmissionImportStatusCreated,
  BulkSubmissionImportStatusRunning,
  BulkSubmissionImportStatusSuccess,
  BulkSubmissionImportStatusWarning,
  BulkSubmissionImportStatusFailed,
] as const

export type BulkSubmissionImportStatus =
  typeof BulkSubmissionImportStatusValue[number]

type BulkSubmissionStatusId = {
  id: number
}

const createInsertQuery = () =>
  `
    INSERT IGNORE INTO bulk_submissions (status, locale_id, size, path, name, submitter, import_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
const insertBulkSubmission =
  (db: Mysql) => (bulkSubmission: BulkSubmission) => {
    return TE.tryCatch(
      async () => {
        const [rows]: [BulkSubmissionStatusId[]] = await db.query(
          `SELECT id from bulk_submission_status WHERE status = 'open'`
        )
        const statusId = rows
          .map(status => status.id)
          .reduce((_, statusId) => statusId)
            console.log('LocaleID:', bulkSubmission.localeId)
        console.log('StatusId: ', statusId)
        ;(await db.query(createInsertQuery(), [
          statusId,
          bulkSubmission.localeId,
          bulkSubmission.size,
          bulkSubmission.path,
          bulkSubmission.name,
          bulkSubmission.submitter,
          bulkSubmission.importStatus,
        ])) as unknown

        return true
      },
      (err: Error) => err
    )
  }

export const insertBulkSubmissionIntoDb = insertBulkSubmission(db)
