import { taskEither as TE } from 'fp-ts'
import { pipe, flow } from 'fp-ts/lib/function'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createDatabaseError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'
import {
  REPORTED_CLIP,
  ReportKind,
  REPORTED_SENTENCE,
} from '../use-case/command-handler/command/create-report-command'

const db = getMySQLInstance()

type ReportTableInfo = {
  table: string
  column: string
}

const getTableInfoFrom = (kind: ReportKind): ReportTableInfo => {
  switch (kind) {
    case REPORTED_CLIP:
      return {
        table: 'reported_clips',
        column: 'clip_id',
      }
    case REPORTED_SENTENCE:
      return {
        table: 'reported_sentences',
        column: 'sentence_id',
      }
  }
}
const createReportQuery = (tableInfo: ReportTableInfo) =>
  `
    INSERT INTO ${tableInfo.table} (client_id, ${tableInfo.column}, reason) VALUES (?, ?, ?)
  `

const createQueryForReportKind = flow(getTableInfoFrom, createReportQuery)

const insertReport =
  (db: Mysql) =>
  (report: {
    clientId: string
    id: string
    kind: ReportKind
    reasons: string[]
  }): TE.TaskEither<ApplicationError, unknown> => {
    return pipe(
      report.reasons.map(reason =>
        TE.tryCatch(
          () =>
            db.query(createQueryForReportKind(report.kind), [
              report.clientId,
              report.id,
              reason,
            ]),
          (err: Error) =>
            createDatabaseError(`Error inserting ${report.kind} report`, err)
        )
      ),
      TE.sequenceSeqArray
    )
  }

export const insertReportIntoDb = insertReport(db)
