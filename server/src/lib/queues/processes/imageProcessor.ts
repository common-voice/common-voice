import { Job } from 'bull';
import Bucket from '../../bucket';
// import { getMySQLInstance } from '../../model/db/mysql';
import UserClient from '../../model/user-client';
import { AWS } from '../../aws';
import { getConfig } from '../../../config-helper';

const uploader = AWS.getS3();
// const db = getMySQLInstance();

const deleteAvatar = async (client_id: string, url: string, s3: any) => {
  const urlParts = url.split('/');
  if (urlParts.length) {
    const fileName = urlParts[urlParts.length - 1];

    await s3
      .deleteObject({
        Bucket: getConfig().CLIP_BUCKET_NAME,
        Key: `${client_id}/${fileName}`,
      })
      .promise();
  }
};

const updateAvatarURL = async (
  client_id: string,
  user: Express.User,
  uploadedImagePath: string,
  s3: any
) => {
  const oldAvatar = await UserClient.updateAvatarURL(
    user.emails[0].value,
    uploadedImagePath
  );
  if (oldAvatar) await deleteAvatar(client_id, oldAvatar, s3);
};

function PromiseTimeout(delayms: number): Promise<any> {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, delayms);
  });
}

const imageProcessor = async (job: Job) => {
  const {
    s3,
    client_id,
    rawImageData,
    key: fileName,
    imageBucket,
    bucket,
    user,
  } = job.data as {
    client_id: string;
    rawImageData: string;
    user: Express.User;
    key: string;
    imageBucket: string;
    s3?: any;
    bucket: any;
  };
  //upload to S3 here
  await PromiseTimeout(10000);
  try {
    await uploader
      .upload({
        Key: fileName,
        Bucket: imageBucket,
        Body: Buffer.from(rawImageData, 'binary'),
        ACL: 'public-read',
      })
      .promise();
    await updateAvatarURL(client_id, user, fileName, uploader);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export default imageProcessor;
