import Mysql from '../mysql'
import { default as Table } from '../table'
import { TaxonomyType } from 'common'

export type DBClip = {
  is_approved: number
  corpus_id: string
  id: number
  client_id: string
  path: string
  sentence: string
  original_sentence_id: string
  has_valid_clip?: number
  taxonomy?: TaxonomyType
  expire_at?: string | null // Added expire_at field (optional, can be NULL)
  variant_name?: string
}

export default class ClipsTable extends Table {
  constructor(mysql: Mysql) {
    super('clips', mysql)
  }
}
