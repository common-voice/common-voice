import { clientId } from '../../../../../core/types/clientId'

export type AddBulkSubmissionCommand = {
  submitter: clientId
  filename: string
  locale: string
  file: string
  size: number
}
