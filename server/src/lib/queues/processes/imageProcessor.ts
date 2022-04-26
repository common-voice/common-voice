import { Job } from 'bull';
import UserClient from '../../model/user-client';
import { AWS } from '../../aws';
import { getConfig } from '../../../config-helper';

const uploader = AWS.getS3();
const getUnsignedUrl = (bucket: string, key: string) => {
  const {
    ENVIRONMENT,
    S3_LOCAL_DEVELOPMENT_ENDPOINT,
    CLIP_BUCKET_NAME,
    AWS_REGION,
  } = getConfig();

  if (ENVIRONMENT === 'local') {
    return `${S3_LOCAL_DEVELOPMENT_ENDPOINT}/${CLIP_BUCKET_NAME}/${key}`;
  }

  return `https://${bucket}.s3.dualstack.${AWS_REGION}.amazonaws.com/${key}`;
};

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

const imageProcessor = async (job: Job) => {
  const {
    client_id,
    rawImageData,
    key: fileName,
    imageBucket,
    user,
  } = job.data as {
    client_id: string;
    rawImageData: string;
    user: Express.User;
    key: string;
    imageBucket: string;
  };
  //upload to S3 here
  try {
    await uploader
      .upload({
        Key: fileName,
        Bucket: imageBucket,
        Body: Buffer.from(rawImageData, 'binary'),
        ACL: 'public-read',
      })
      .promise();
    const avatarURL = getUnsignedUrl(getConfig().CLIP_BUCKET_NAME, fileName);

    await updateAvatarURL(client_id, user, avatarURL, uploader);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export default imageProcessor;
