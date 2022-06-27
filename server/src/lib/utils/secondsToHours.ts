const HOUR_IN_SECONDS = 3600;

/**
 * Converts seconds to hours, defaults to 0 if no seconds provided. Rounds up to nears whole number.
 * 2.1 hours will be returned as 3
 * @param {number} seconds
 * @return {number} hours
 */
export const secondsToHours = (seconds: number): number => {
  return Math.ceil(seconds / HOUR_IN_SECONDS) || 0;
};
