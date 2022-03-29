import * as Queue from 'bull';
import { getConfig } from '../../config-helper';
import imageProcessor from './processes/imageProcessor'; // producer

const getRedisConfig = () => {
  const redisUrlParts = getConfig().REDIS_URL?.split('//');
  if (!redisUrlParts) return { host: '' }; //config fails on test

  const redisDomain =
    redisUrlParts.length > 1 ? redisUrlParts[1] : redisUrlParts[0];

  let redisOpts: any = { host: redisDomain };
  if (getConfig().REDIS_URL.includes('rediss://')) {
    redisOpts = { ...redisOpts, tls: redisOpts };
  }
  return redisOpts;
};

const NotificationQueue = new Queue('Notification', {
  redis: getRedisConfig(),
}); // consumer
NotificationQueue.process(imageProcessor);
NotificationQueue.on('completed', (job, result) => {
  if (result) {
    console.log(`Success: Job ${job.id}`);
  } else {
    console.log(`Fail: Job ${job.id}`);
  }
});

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
