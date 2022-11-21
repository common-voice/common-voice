import * as Queue from 'bull';
import { getConfig } from '../../config-helper';
import clipProcessor from './processes/clipProcessor';

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

const jobOptions = {
  repeat: {
    every: 10 * 1000, // Run job every 10 seconds for example
    limit: 3, // Maximum number of times a job can repeat.
  },
  jobId: 'someUniqueId', // important do not forget this
};

export const clipQueue = new Queue('clipQueue', {
  redis: getRedisConfig(),
  defaultJobOptions: jobOptions,
});

clipQueue.on('error', err => console.error(err));
clipQueue.on('completed', (job, result) => {
  if (result) {
    console.log(`Success: Job ${job.id}`);
  } else {
    console.log(`Fail: Job ${job.id}`);
  }
});

clipQueue.add({ thisIsaTest: 'testdata' }, jobOptions);
clipQueue.process(clipProcessor);
