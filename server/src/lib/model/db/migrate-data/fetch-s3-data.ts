import { getConfig } from '../../../../config-helper';
import { AWS } from '../../../aws';
import { sleep } from '../../../utility';
import { rateLimit } from './aws-rate-limit';

const KEYS_PER_REQUEST = 1000; // Max is 1000.

const MP3_EXT = '.mp3';
const VOTE_EXT = '.vote';

export interface ClipData {
  type: 'clip';
  client_id: string;
  original_sentence_id: string;
  path: string;
}

export interface VoteData {
  type: 'vote';
  clip_client_id: string;
  clip_sentence_id: string;
  voter_client_id: string;
}

interface S3Results {
  filePaths: string[];
  continuationToken: string | null;
}

export class S3Fetcher {
  private fileCount: number;
  private parentPrint: any;

  constructor(print: any) {
    this.fileCount = 0;
    this.parentPrint = print;
  }

  private processFilePath(path: string): ClipData | VoteData | undefined {
    const dotIndex = path.indexOf('.');

    // Filter out any directories.
    if (dotIndex === -1) {
      return;
    }

    ++this.fileCount;

    // Glob is a path in the form $userid/$sentenceid.
    const glob = path.substr(0, dotIndex);
    const ext = path.substr(dotIndex);

    if (!glob) {
      return;
    }

    let [client_id, sentence_id] = glob.split('/');

    if (!sentence_id) return;

    switch (ext) {
      case MP3_EXT:
        return {
          type: 'clip',
          client_id,
          original_sentence_id: sentence_id,
          path,
        };

      case VOTE_EXT:
        let [clip_sentence_id, voter_client_id] = sentence_id.split('-by-');
        return {
          type: 'vote',
          clip_sentence_id,
          clip_client_id: client_id,
          voter_client_id,
        };
    }
  }

  private print(...args: any[]) {
    this.parentPrint('FETCH-S3 --', ...args);
  }

  private fetchObjects(continuationToken?: string): Promise<S3Results> {
    return new Promise((resolve, reject) => {
      const s3 = AWS.getS3();
      let awsRequest = s3.listObjectsV2({
        Bucket: getConfig().BUCKET_NAME,
        MaxKeys: KEYS_PER_REQUEST,
        ContinuationToken: continuationToken,
      });

      awsRequest.on('success', (response: any) => {
        resolve({
          filePaths: response['data']['Contents'].map(
            (content: any) => content.Key
          ),
          continuationToken: response['data']['NextContinuationToken'],
        });
      });

      awsRequest.on('error', (err: any) => {
        if (err.code === 'AccessDenied' || err.code === 'CredentialsError') {
          console.error('s3 aws creds not configured properly');
          reject(err);
        }

        // For other errors like timeout, we trap the error here, and return
        // the same continuation token we were given so that the caller
        // may try again.
        console.error('Error while fetching clip list:', err.code);
        resolve({
          filePaths: [],
          continuationToken: continuationToken,
        });
      });

      awsRequest.send();
    });
  }

  start = async function* start(): any {
    let chunkCount = 0;
    let token: string;
    do {
      ++chunkCount;
      const startRequest = Date.now();
      const result = await this.fetchObjects(token);
      const secondsToLoad = ((Date.now() - startRequest) / 1000).toFixed(2);
      this.print(`${secondsToLoad}s to load`);

      for (const path of result.filePaths) {
        const data = this.processFilePath(path);
        if (data) yield data;
      }

      token = result.continuationToken;
      if (token) {
        await rateLimit();
      }
    } while (token);

    this.print(`Loaded ${chunkCount} chunks`);
  };
}

export async function* fetchS3Data(print: any): any {
  yield* await new S3Fetcher(print).start();
}
