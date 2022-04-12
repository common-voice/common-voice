import { getConfig } from '../config-helper';
import { SQS, S3 } from 'aws-sdk';

const awsDefaults = {
  signatureVersion: 'v4',
  useDualstack: true,
  region: getConfig().AWS_REGION,
};

export namespace AWS {
  let s3 = new S3({ ...awsDefaults, ...getConfig().S3_CONFIG });
  let sqs = new SQS({
    ...awsDefaults,
    region: 'us-east-1',
    ...getConfig().CINCHY_CONFIG,
  });

  export function getS3() {
    return s3;
  }

  export function getSqs() {
    return sqs;
  }
}
