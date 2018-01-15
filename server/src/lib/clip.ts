import * as crypto from 'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import * as ms from 'mediaserver';
import * as mkdirp from 'mkdirp';

import { CommonVoiceConfig } from '../config-helper';
import { AWS } from './aws';
import Model from './model';
import Bucket from './bucket';
import { getFileExt } from './utility';
import respond, { CONTENT_TYPES } from './responder';

const ff = require('ff');
const Transcoder = require('stream-transcoder');

const UPLOAD_PATH = path.resolve(__dirname, '../..', 'upload');
const ACCEPTED_EXT = ['.mp3', '.ogg', '.webm', '.m4a'];
const SALT = '8hd3e8sddFSdfj';

const AVG_CLIP_SECONDS = 4.25; // I queried 40 recordings from prod and avg'd them

export const hash = (str: string) =>
  crypto
    .createHmac('sha256', SALT)
    .update(str)
    .digest('hex');

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Clip {
  private config: CommonVoiceConfig;
  private s3: S3;
  private bucket: Bucket;
  private model: Model;
  isMigrated: boolean;

  constructor(config: CommonVoiceConfig, model: Model) {
    this.config = config;
    this.s3 = AWS.getS3();
    this.model = model;
    this.bucket = new Bucket(this.config, this.model, this.s3);
  }

  /**
   * This function downloads and clip from s3 and streams to the broweer.
   * Note: this function is rarely used as we now issue a temporary s3 url
   *       directly to the client rather than stream from the server.
   */
  private streamAudio(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    key: string
  ): void {
    // Save the data locally, stream to client, remove local data (Performance?)
    const tmpFilePath = path.join(UPLOAD_PATH, key);
    const tmpFileDirectory = path.dirname(tmpFilePath);
    const f = ff(
      () => {
        mkdirp(tmpFileDirectory, f.wait());
      },
      () => {
        const retrieveParam = { Bucket: this.config.BUCKET_NAME, Key: key };
        const awsResult = this.s3.getObject(retrieveParam);
        f.pass(awsResult);
      },
      (awsResult: any) => {
        let tmpFile = fs.createWriteStream(tmpFilePath);
        tmpFile = awsResult.createReadStream().pipe(tmpFile);
        tmpFile.on('finish', f.wait());
      },
      () => {
        ms.pipe(request, response, tmpFilePath);
      }
    ).onError((err: any) => {
      console.error('streaming audio error', err, err.stack);
      respond(response, 'Server error, could not fetch audio data.', 500);
    });
  }

  /**
   * Turn a server url into a S3 file path.
   */
  private getS3FilePath(url: string): string {
    let parts = url.split('/');
    let fileName = parts.pop();
    let folder = parts.pop();
    return folder + '/' + fileName;
  }

  /**
   * Prepare a list of data files from our data bucket.
   */
  async loadCache(): Promise<void> {
    await this.bucket.loadCache();
  }

  /**
   * Is this request directed at voice clips?
   */
  isClipRequest(request: http.IncomingMessage) {
    return request.url.includes('/upload/');
  }

  /**
   * Is this a random clip for voice file urls?
   */
  isRandomClipJsonRequest(request: http.IncomingMessage): boolean {
    return request.url.includes('/upload/random.json');
  }

  /**
   * Is this request to vote on a voice clip?
   */
  isClipVoteRequest(request: http.IncomingMessage) {
    return request.url.includes('/upload/vote');
  }

  /**
   * Is this request to save demographic info?
   */
  isClipDemographic(request: http.IncomingMessage) {
    return request.url.includes('/upload/demographic');
  }

  isValidatedHoursRequest(request: http.IncomingMessage) {
    return request.url.includes('/upload/hours');
  }

  /**
   * Distinguish between uploading and listening requests.
   */
  async handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ): Promise<void> {
    if (request.method === 'POST') {
      if (this.isClipVoteRequest(request)) {
        // Note: Check must occur first
        this.saveClipVote(request, response);
      } else if (this.isClipDemographic(request)) {
        this.saveClipDemographic(request, response);
      } else {
        this.saveClip(request, response);
      }
    } else if (this.isRandomClipJsonRequest(request)) {
      await this.serveRandomClip(request, response);
    } else if (this.isValidatedHoursRequest(request)) {
      await this.serveValidatedHoursCount(request, response);
    } else {
      this.serve(request, response);
    }
  }

  /**
   * Save clip vote posted to server
   */
  saveClipVote(request: http.IncomingMessage, response: http.ServerResponse) {
    this.saveVote(request)
      .then(timestamp => {
        respond(response, '' + timestamp);
      })
      .catch(e => {
        console.error('saving clip vote error', e, e.stack);
        respond(response, 'Error', 500);
      });
  }

  /**
   * Save the request clip vote in S3
   */
  async saveVote(request: http.IncomingMessage): Promise<string> {
    const { glob, uid } = request.headers;

    const vote = decodeURI(request.headers.vote as string);

    if (!uid || !glob || !vote) {
      return Promise.reject('Invalid headers');
    }

    if (this.isMigrated) {
      await this.model.db.saveVote(glob, uid, vote);
    }

    return new Promise<string>((resolve: Function, reject: Function) => {
      // Where is the clip vote going to be located?
      const voteFile = glob + '-by-' + uid + '.vote';

      let f = ff(
        () => {
          // Save vote to S3
          let params = {
            Bucket: this.config.BUCKET_NAME,
            Key: voteFile,
            Body: vote,
          };
          this.s3.putObject(params, f());
        },
        () => {
          // File saving is now complete.
          console.log('clip vote written to s3', voteFile);
          resolve(glob);
        }
      ).onError(reject);
    });
  }

  /**
   * Save clip demographic posted to server
   */
  saveClipDemographic(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    this.saveDemographic(request)
      .then(timestamp => {
        respond(response, '' + timestamp);
      })
      .catch(e => {
        console.error('saving clip demographic error', e, e.stack);
        respond(response, 'Error', 500);
      });
  }

  /**
   * Save the request clip demographic in S3
   */
  saveDemographic(request: http.IncomingMessage): Promise<string> {
    let uid = request.headers.uid;
    let demographic = request.headers.demographic as string;

    if (!uid || !demographic) {
      return Promise.reject('Invalid headers');
    }

    return new Promise((resolve: Function, reject: Function) => {
      // Where is the clip demographic going to be located?
      let demographicFile = uid + '/demographic.json';

      let f = ff(
        () => {
          // Save demographic to S3
          let params = {
            Bucket: this.config.BUCKET_NAME,
            Key: demographicFile,
            Body: demographic,
          };
          this.s3.putObject(params, f());
        },
        () => {
          // File saving is now complete.
          console.log('clip demographic written to s3', demographicFile);
          resolve(uid);
        }
      ).onError(reject);
    });
  }

  /**
   * Save clip posted to server
   */
  saveClip(request: http.IncomingMessage, response: http.ServerResponse) {
    this.save(request)
      .then(timestamp => {
        respond(response, '' + timestamp);
      })
      .catch(e => {
        console.error('saving clip error', e, e.stack);
        respond(response, 'Error', 500);
      });
  }

  /**
   * Save the request body as an audio file.
   */
  save(request: http.IncomingMessage): Promise<string> {
    let info = request.headers;
    let uid = info.uid;
    let sentence = decodeURI(info.sentence as string);

    if (!uid || !sentence) {
      return Promise.reject('Invalid headers');
    }

    return new Promise((resolve: Function, reject: Function) => {
      // Obtain contentType
      let contentType = info['content-type'] as string;

      // Where is our audio clip going to be located?
      let folder = uid + '/';
      let filePrefix = hash(sentence);
      let file = folder + filePrefix + '.mp3';
      let txtFile = folder + filePrefix + '.txt';

      let f = ff(
        () => {
          // if the folder does not exist, we create it
          let params = { Bucket: this.config.BUCKET_NAME, Key: folder };
          this.s3.putObject(params, f.wait());

          // If we were given base64, we'll need to concat it all first
          // So we can decode it in the next step.
          if (contentType.includes('base64')) {
            let chunks: Buffer[] = [];
            f.pass(chunks);
            request.on('data', (chunk: Buffer) => {
              chunks.push(chunk);
            });
            request.on('end', f.wait());
          }
        },
        (chunks: Buffer[]) => {
          // If upload was base64, make sure we decode it first.
          if (contentType.includes('base64')) {
            let passThrough = new PassThrough();
            passThrough.end(
              Buffer.from(Buffer.concat(chunks).toString(), 'base64')
            );
            let transcoder = new Transcoder(passThrough);
            transcoder = transcoder.audioCodec('mp3').format('mp3');
            let transcoderStream = transcoder.stream();
            let params = {
              Bucket: this.config.BUCKET_NAME,
              Key: file,
              Body: transcoderStream,
            };
            this.s3.upload(params, f());
          } else {
            // For now base64 uploads, we can just stream data.
            let transcoder = new Transcoder(request);
            transcoder = transcoder.audioCodec('mp3').format('mp3');
            let transcoderStream = transcoder.stream();
            let params = {
              Bucket: this.config.BUCKET_NAME,
              Key: file,
              Body: transcoderStream,
            };
            this.s3.upload(params, f());
          }

          // Don't forget about the sentence text!
          let params = {
            Bucket: this.config.BUCKET_NAME,
            Key: txtFile,
            Body: sentence,
          };
          this.s3.putObject(params, f());
        },
        () => {
          // File saving is now complete.
          console.log('file written to s3', file);
          if (this.isMigrated) {
            this.model.db.saveClip(uid, filePrefix, file, sentence);
          }
          resolve(filePrefix);
        }
      ).onError(reject);
    });
  }

  async serveRandomClip(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ): Promise<void> {
    let uid = request.headers.uid as string;
    if (!uid) {
      respond(response, 'Invalid headers', 400);
      return Promise.reject('Invalid headers');
    }

    try {
      const clipJson = await this.bucket.getRandomClipJson(uid);
      respond(response, clipJson, 200, CONTENT_TYPES.JSON);
    } catch (err) {
      console.error('could not get random clip:', (err as Error).message);
      respond(response, 'Still loading', 500);
    }
  }

  /*
   * Fetch an audio file.
   */
  serve(request: http.IncomingMessage, response: http.ServerResponse) {
    let prefix = this.getS3FilePath(request.url);

    let searchParam = { Bucket: this.config.BUCKET_NAME, Prefix: prefix };
    this.s3.listObjectsV2(searchParam, (err: any, data: any) => {
      if (err) {
        console.error('Did not find specified clip', err);
        respond(response, 'Unknown File', 404);
        return;
      }

      // Try to find the right key, since we don't know the extension.
      let key = null;
      for (let i = 0; i < data.Contents.length; i++) {
        let ext = getFileExt(data.Contents[i].Key);
        if (ACCEPTED_EXT.indexOf(ext) !== -1) {
          key = data.Contents[i].Key;
          break;
        }
      }

      if (!key) {
        console.error('could not find clip', data.Contents);
        respond(response, 'Unknown File', 404);
        return;
      }

      // Stream audio to client
      this.streamAudio(request, response, key);
    });
  }

  private validatedHours: number;
  private lastValidatedHoursCheck: Date;
  async serveValidatedHoursCount(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      !this.lastValidatedHoursCheck ||
      this.lastValidatedHoursCheck < yesterday
    ) {
      this.validatedHours = Math.round(
        (await this.model.db.getValidatedClipsCount()) * AVG_CLIP_SECONDS / 3600
      );
      this.lastValidatedHoursCheck = new Date();
    }
    respond(response, this.validatedHours.toString());
  }
}
