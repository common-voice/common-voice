//register scheduled jobs

import { clipQueue } from '../lib/queues/clipQueue';

export const instantiateScheduledJobs = () => {
  console.log('Instantiated: ', clipQueue.name);
};
