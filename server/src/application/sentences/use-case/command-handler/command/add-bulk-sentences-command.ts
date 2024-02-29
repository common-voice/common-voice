import { Readable } from "stream";

export type AddBulkSentencesCommand = {
  email: string
  tsvFile: Readable
  localeId: number
}
