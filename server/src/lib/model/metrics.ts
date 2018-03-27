import DB from './db';
import { normalize, rowsToDistribution, Split } from './split';

const REFRESH_INTERVAL = 60 * 60 * 1000; // == 1 Hour

const db = new DB();

interface Metrics {
  user_clients: {
    total: number;
    listeners: string;
    submitters: string;
  };
  users: {
    total: number;
    downloaders: string;
    with_emails: string;
  };
  sentences: {
    total: number;
    with_no_clips: number;
  };
  clips: {
    total: number;
    unverified: string;
    current_distribution: Split;
  };
  votes: {
    total: number;
  };
}

function asPercentageString(n: number) {
  return (100 * n).toFixed(2) + '%';
}

async function fetchUserClientsMetrics() {
  const total = await db.getUserClientCount();
  return {
    total,
    listeners: asPercentageString((await db.getListenerCount()) / total),
    submitters: asPercentageString((await db.getSubmitterCount()) / total),
  };
}

async function fetchUsersMetrics() {
  const total = await db.getUserCount();
  return {
    total,
    downloaders: asPercentageString(
      (await db.getDownloadingUserCount()) / total
    ),
    with_emails: asPercentageString((await db.getEmailsCount()) / total),
  };
}

async function fetchClipsMetrics() {
  const total = await db.getClipCount();
  const unverified = total - (await db.getValidatedClipsCount());

  return {
    total,
    unverified: asPercentageString(unverified / total),
    current_distribution: Object.entries(
      normalize(rowsToDistribution(await db.getClipBucketCounts()))
    )
      .map(([bucket, n]) => [bucket, asPercentageString(n)])
      .reduce((obj: any, [k, v]) => {
        obj[k] = v;
        return obj;
      }, {}),
  };
}

let lastMetricsRefreshAt: number;
let metrics: Metrics;
export default async function fetchMetrics(): Promise<Metrics> {
  const now = Date.now();
  if (now - lastMetricsRefreshAt < REFRESH_INTERVAL) {
    return metrics;
  }

  lastMetricsRefreshAt = now;

  return (metrics = {
    user_clients: await fetchUserClientsMetrics(),
    users: await fetchUsersMetrics(),
    sentences: {
      total: await db.getSentencesCount(),
      with_no_clips: await db.getSentencesWithNoClipsCount(),
    },
    clips: await fetchClipsMetrics(),
    votes: {
      total: await db.getVoteCount(),
    },
  });
}
