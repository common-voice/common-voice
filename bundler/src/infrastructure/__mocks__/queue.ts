/* eslint-disable @typescript-eslint/no-empty-function */
// Manual Jest mock for infrastructure/queue.
// Usage: jest.mock('../infrastructure/queue')
//
// Prevents BullMQ from opening a real Redis connection during tests.

export const addJobsToReleaseQueue = jest.fn(() => async () => {})
export const cleanStaleJobs = jest.fn(async () => {})
export const drainQueue = jest.fn(async () => {})
export const removeJobsForLocales = jest.fn(async () => {})
