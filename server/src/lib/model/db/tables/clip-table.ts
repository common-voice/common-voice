import Mysql from '../mysql';
import { default as Table } from '../table';
import { TaxonomyType } from 'common';

export type DBClip = {
  id: number;
  client_id: string;
  path: string;
  sentence: string;
  original_sentence_id: string;
  has_valid_clip?: number;
  taxonomy?: TaxonomyType;
};

export default class ClipsTable extends Table {
  constructor(mysql: Mysql) {
    super('clips', mysql);
  }
}
