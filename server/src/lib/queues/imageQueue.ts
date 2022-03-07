// import { S3 } from 'aws-sdk';
import * as Queue from 'bull';
import { getConfig } from '../../config-helper';
// import Bucket from '../bucket';
import imageProcessor from './processes/imageProcessor'; // producer

const redisUrlParts = getConfig().REDIS_URL?.split('//');
const redisDomain =
  redisUrlParts.length > 1 ? redisUrlParts[1] : redisUrlParts[0];

let redisOpts: any = { host: redisDomain };
if (getConfig().REDIS_URL.includes('rediss://')) {
  redisOpts = { ...redisOpts, tls: redisOpts };
}

const NotificationQueue = new Queue('Notification', { redis: redisOpts }); // consumer
NotificationQueue.process(imageProcessor);

export const uploadImage = async (data: {
  client_id: string;
  rawImageData: string;
  user: Express.User;
  key: string;
  imageBucket: string;
  s3?: any;
  bucket?: any;
}) => {
  return await NotificationQueue.add(data);
};

export default NotificationQueue;
