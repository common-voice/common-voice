const HOUR_IN_SECONDS = 3600

/**
 * Converts seconds to hours, defaults to 0 if no seconds provided. Rounds up to nears whole number for
 * durations longer than 10 hours. Durations shorter than 10h will be displayed with a decimal.
 * @example
 * 2.1 hours will be returned as 2.1 hours
 * 12.1 hours will be returned as 13 hours
 * @param {number} seconds
 * @return {number} hours
 */
export const secondsToHours = (seconds: number): number => {
  if (seconds <= 0) return 0

  const hours = seconds / HOUR_IN_SECONDS
  return hours >= 10 ? Math.ceil(hours) : parseFloat(hours.toFixed(1))
}
