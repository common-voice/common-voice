import { getConfig } from '../config-helper';
import { config, S3 } from 'aws-sdk';

const awsDefaults = {
  signatureVersion: 'v4',
  useDualstack: true,
  region: getConfig().BUCKET_LOCATION,
};

export namespace AWS {
  let s3 = new S3({ ...awsDefaults, ...getConfig().S3_CONFIG });

  export function getS3() {
    return s3;
  }
}
