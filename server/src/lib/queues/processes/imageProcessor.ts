import { S3 } from 'aws-sdk';
import { Job } from 'bull';
import Bucket from '../../bucket';
import { getMySQLInstance } from '../../model/db/mysql';
import UserClient from '../../model/user-client';

const db = getMySQLInstance();

const updateAvatarURL = async (
  client_id: string,
  user: Express.User,
  uploadedImagePath: string,
  bucket: Bucket
) => {
  const oldAvatar = await UserClient.updateAvatarURL(
    user.emails[0].value,
    uploadedImagePath
  );
  if (oldAvatar) await bucket.deleteAvatar(client_id, oldAvatar);
};

const imageProcessor = async (job: Job) => {
  const {
    s3,
    client_id,
    rawImageData,
    key: fileName,
    imageBucket,
    bucket,
  } = job.data as {
    client_id: string;
    rawImageData: string;
    user: Express.User;
    key: string;
    imageBucket: string;
    s3: S3;
    bucket: Bucket;
  };
  //upload to S3 here
  console.log('hello', s3);
  try {
    await s3
      .upload({
        Key: fileName,
        Bucket: imageBucket,
        Body: rawImageData,
        ACL: 'public-read',
      })
      .promise();
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export default imageProcessor;
