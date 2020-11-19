import { getConfig } from '../config-helper';
import { config, S3, STS } from 'aws-sdk';

const awsDefaults = {
  signatureVersion: 'v4',
  useDualstack: true,
  region: getConfig().AWS_REGION,
};

const tokenParams = {
  DurationSeconds: 12 * 60 * 60,
  RoleArn: getConfig().AWS_ROLE_ARN,
  RoleSessionName: 'voice-prod-token',
  WebIdentityToken: getConfig().AWS_WEB_TOKEN,
};

export namespace AWS {
  let s3: S3;
  let sts = new STS();

  export function getS3() {
    if (!this.s3) {
      let params = { ...awsDefaults, ...getConfig().S3_CONFIG };
      try {
        sts.assumeRoleWithWebIdentity(tokenParams, (err, data) => {
          if (err) console.error(err, err.stack);
          else {
            params.credentials = {
              accessKeyId: data.Credentials.AccessKeyId,
              secretAccessKey: data.Credentials.SecretAccessKey,
              sessionToken: data.Credentials.SessionToken,
            };
          }
        });
      } catch (err) {
        console.error(`Problem encountered assuming STS role: ${err.message}`);
      }

      this.s3 = new S3(params);
    }

    return this.s3;
  }
}
