import { IConnection } from 'mysql2Types';
import { VoteData } from './fetch-s3-data';

export async function migrateVotes(
  connection: IConnection,
  votes: VoteData[],
  print: any
) {}
