import * as Queue from 'bull';
import { getConfig } from '../../config-helper';
import accountProcessor from './processes/accountProcessor'; // producer

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

const AccountQueue = new Queue('Account', {
  redis: getRedisConfig(),
}); // consumer
AccountQueue.process(accountProcessor);

AccountQueue.on('completed', (job, result) => {
  if (result) {
    console.log(`Success: Account Deletion Job ${job.id}`);
  } else {
    console.log(`Fail: Account Deletion Job ${job.id}`);
  }
});

export const deleteAccount = async (user: Express.User) => {
  return await AccountQueue.add(user);
};

export default AccountQueue;
