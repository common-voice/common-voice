import EmailClient from '../../lib/email'
import {taskEither as TE} from 'fp-ts'
import { BulkSubmissionEmailData } from '../../core/bulk-submissions/types/bulk-submission';

const emailClient = new EmailClient();

export const sendNotificationEmail = (emailClient: EmailClient) => (emailData: BulkSubmissionEmailData) => {
  return TE.tryCatch(
    async () => {
      await emailClient.sendBulkSubmissionNotificationEmail(emailData)
      return true
    },
    (err: Error) => err
  )
}

export const sendBulkSubmissionNotificationEmail = sendNotificationEmail(emailClient)
