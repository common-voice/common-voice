import { getConfig } from '../../../../config-helper';
import { AWS } from '../../../aws';
import { sleep } from '../../../utility';

const KEYS_PER_REQUEST = 1000; // Max is 1000.
const LOAD_DELAY = 200;

const MP3_EXT = '.mp3';
const VOTE_EXT = '.vote';

export interface ClipData {
  client_id: string;
  original_sentence_id: string;
  path: string;
}

export interface VoteData {
  clip_client_id: string;
  clip_sentence_id: string;
  voter_client_id: string;
}

export interface S3Data {
  client_ids: string[];
  clips: ClipData[];
  votes: VoteData[];
}

interface S3Results {
  filePaths: string[];
  continuationToken: string | null;
}

export class S3Fetcher {
  private fileCount: number;
  private parentPrint: any;
  private result: S3Data = {
    client_ids: [],
    clips: [],
    votes: [],
  };

  constructor(print: any) {
    this.fileCount = 0;
    this.parentPrint = print;
  }

  private async processFilePath(path: string) {
    const dotIndex = path.indexOf('.');

    // Filter out any directories.
    if (dotIndex === -1) {
      return;
    }

    ++this.fileCount;

    // Glob is a path in the form $userid/$sentenceid.
    const glob = path.substr(0, dotIndex);
    const ext = path.substr(dotIndex);

    let [client_id, sentence_id] = glob.split('/');

    switch (ext) {
      case MP3_EXT:
        this.result.client_ids.push(client_id);
        this.result.clips.push({
          client_id,
          original_sentence_id: sentence_id,
          path,
        });
        break;

      case VOTE_EXT:
        let [clip_sentence_id, voter_client_id] = sentence_id.split('-by-');
        this.result.client_ids.push(voter_client_id, client_id);
        this.result.votes.push({
          clip_sentence_id,
          clip_client_id: client_id,
          voter_client_id,
        });
        break;
    }
  }

  private print(...args: any[]) {
    this.parentPrint('FETCH-S3 --', ...args);
  }

  private fetchObjects(continuationToken?: string): Promise<S3Results> {
    return new Promise((res, rej) => {
      const s3 = AWS.getS3();
      let awsRequest = s3.listObjectsV2({
        Bucket: getConfig().BUCKET_NAME,
        MaxKeys: KEYS_PER_REQUEST,
        ContinuationToken: continuationToken,
      });

      awsRequest.on('success', async (response: any) => {
        const results: S3Results = {
          filePaths: [],
          continuationToken: response['data']['NextContinuationToken'],
        };

        // Grab all the file paths from the response object.
        const contents = response['data']['Contents'];
        for (let i = 0; i < contents.length; i++) {
          await this.processFilePath(contents[i].Key);
          results.filePaths.push(contents[i].Key);
        }

        res(results);
      });

      awsRequest.on('error', (err: any) => {
        if (err.code === 'AccessDenied' || err.code === 'CredentialsError') {
          console.error('s3 aws creds not configured properly');
          rej(err);
          return;
        }

        // For other errors like timeout, we trap the error here, and return
        // the same continuation token we were given so that the caller
        // may try again.
        console.error('Error while fetching clip list:', err.code);
        res({
          filePaths: [],
          continuationToken: continuationToken,
        });
      });

      awsRequest.send();
    });
  }

  async start(): Promise<S3Data> {
    let chunkCount = 0;
    let startLoading = Date.now();

    let next: string;
    do {
      ++chunkCount;
      const startRequest = Date.now();
      const results = await this.fetchObjects(next);

      const now = Date.now();
      const secondsToLoad = ((now - startRequest) / 1000).toFixed(2);
      const timeSoFar = ((now - startLoading) / 1000).toFixed(2);
      this.print(
        `${secondsToLoad}s to load, ${timeSoFar}s total, ${chunkCount} chunks, ${this.fileCount} files, ${this.result.client_ids.length} clients, ${this.result.clips.length} clips, ${this.result.votes.length} votes`
      );

      next = results.continuationToken;
      if (next) {
        // Take a breather in between chunks to handle incoming requests.
        await sleep(LOAD_DELAY);
      }
    } while (next);

    // Output bucket loading metrics.
    let totalTime = ((Date.now() - startLoading) / 1000).toFixed(2);
    this.print(`${totalTime}s to load ${chunkCount} chunks`);

    return this.result;
  }
}

export async function fetchS3Data(print: any): Promise<S3Data> {
  return new S3Fetcher(print).start();
}
