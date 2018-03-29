import Mysql from '../mysql';
import { default as Table } from '../table';

export type DBClip = {
  id: number;
  client_id: string;
  path: string;
  sentence: string;
  original_sentence_id: string;
  bucket: 'train' | 'dev' | 'test';
};

export interface DBClipWithVoters extends DBClip {
  voters: string[];
}

export default class ClipsTable extends Table<{}> {
  constructor(mysql: Mysql) {
    super('clips', mysql);
  }
}
