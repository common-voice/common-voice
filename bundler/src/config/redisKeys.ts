// ---------------------------------------------------------------------------
// Redis key builders
//
// Prefix `scripted:` namespaces keys for the scripted-speech bundler.
// Future bundlers (SPS, CS) can use their own prefix without colliding.
// ---------------------------------------------------------------------------

const REDIS_PREFIX = 'scripted'

export const redisKeys = {
  /** List of serialised TSV rows for the problem-clips report. */
  problemClips: (releaseName: string) =>
    `${REDIS_PREFIX}:log:problem-clips:${releaseName}`,
  /** List of serialised TSV rows for the process-log report. */
  processLog: (releaseName: string) =>
    `${REDIS_PREFIX}:log:process:${releaseName}`,
  /** Counter -- number of locale jobs completed (incremented by each pod). */
  localeCount: (releaseName: string) =>
    `${REDIS_PREFIX}:jobs:count:${releaseName}`,
  /** Total locale jobs scheduled (accumulated with INCRBY across batches). */
  localeTotal: (releaseName: string) =>
    `${REDIS_PREFIX}:jobs:total:${releaseName}`,
  /** Counter -- cumulative clips processed across completed jobs. */
  clipsCount: (releaseName: string) =>
    `${REDIS_PREFIX}:clips:count:${releaseName}`,
  /** Total expected clips (accumulated with INCRBY from init query results). */
  clipsTotal: (releaseName: string) =>
    `${REDIS_PREFIX}:clips:total:${releaseName}`,
  /** ISO 8601 timestamp of the first init job (SET NX -- never overwritten). */
  timeStart: (releaseName: string) =>
    `${REDIS_PREFIX}:time:start:${releaseName}`,
  /**
   * SET of locale names that have been successfully processed.
   * Used as a fast-path duplicate check before the authoritative GCS call.
   */
  done: (releaseName: string) => `${REDIS_PREFIX}:done:${releaseName}`,
  /**
   * SET of locale identifiers currently being processed.
   * Guards against duplicate processing when BullMQ re-dispatches a job
   * after its lock key is evicted by Redis LRU. Cleared by the init
   * handler on each new run so that re-runs can reprocess failed locales.
   */
  processing: (releaseName: string) =>
    `${REDIS_PREFIX}:processing:${releaseName}`,
  /** ISO 8601 timestamp of the last GCS log flush. */
  lastFlush: (releaseName: string) =>
    `${REDIS_PREFIX}:log:last-flush:${releaseName}`,
}
