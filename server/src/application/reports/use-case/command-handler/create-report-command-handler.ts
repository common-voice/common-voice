import { insertReportIntoDb } from '../../repository/reports-repository'
import { CreateReportCommand } from './command/create-report-command'

export const createReportCommandHandler = (command: CreateReportCommand) => {
  return insertReportIntoDb(command)
}
