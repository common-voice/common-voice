/**
 * Single instance for the S3 aws-sdk object.
 * Use this instance when needed. Don't create new S3 objects inside the
 * server.
 */
import { S3 } from 'aws-sdk';

export namespace S3Service {
  let s3 = new S3({ signatureVersion: 'v4' });
  export function getInstance() {
    return s3;
  }
}
