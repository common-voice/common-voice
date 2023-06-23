import * as Queue from "bull";
import { saveData } from "./sync-pontoon-statistics";
import { getRedisConfig } from "../queues/imageQueue";

const QUEUE_OPTIONS = {
  NAMES: {
    STATISTICS: "stats",
  },
};

const SCHEDULE_OPTIONS = {
  repeat: {
    every: 10000,
  },
};

export const statisticsQueue = new Queue(
  QUEUE_OPTIONS.NAMES.STATISTICS,
  "redis",
  {
    redis: getRedisConfig(),
  }
);

export const scheduler = () => {
  statisticsQueue.add(
    QUEUE_OPTIONS.NAMES.STATISTICS,
    {}
    // SCHEDULE_OPTIONS
  );
};

statisticsQueue.process(QUEUE_OPTIONS.NAMES.STATISTICS, (job, done) => {
  console.log(job.data);
  saveData();
  done();
});
