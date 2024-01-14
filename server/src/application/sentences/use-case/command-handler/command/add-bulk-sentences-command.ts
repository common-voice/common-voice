import { Readable } from "stream";

export type AddBulkSentencesCommand = {
  clientId: string
  tsvFile: Readable
  localeId: number
}
