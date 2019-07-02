import { SEXES, AGES, LANGUAGES, DemoInfo } from './valid-demographics';

const md5 = require('js-md5');
const DEFAULT_SALT = '8shd9fg3oi0fj';

/**
 * Validate the demographic info
 */
export function validateDemographic({ sex, age, native_language }: DemoInfo) {
  console.log(sex);
  console.log(age);
  console.log(native_language);
  console.log(SEXES.includes(sex));
  console.log(AGES.includes(age));
  console.log(LANGUAGES.includes(native_language));

  if (
    SEXES.includes(sex) &&
    AGES.includes(age) &&
    LANGUAGES.includes(native_language)
  ) {
    return true;
  }
  return false;
}

/**
 * Hash the string.
 */
export function hash(str: string, salt?: string): string {
  return md5(str + (salt || DEFAULT_SALT));
}

/**
 * Get elapsed seconds from timestamp.
 */
export function getElapsedSeconds(timestamp: number): number {
  return Math.round((Date.now() - timestamp) / 1000);
}

/**
 * Returns the first defined argument. Returns null if there are no defined
 * arguments.
 */
export function getFirstDefined(...options: any[]) {
  for (let i = 0; i < options.length; i++) {
    if (options[i] !== undefined) {
      return options[i];
    }
  }
  return null;
}

export class APIError extends Error {
  constructor(message?: string) {
    // 'Error' breaks prototype chain here
    super(message);

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = new.target.prototype;
    }
  }
}
export class ServerError extends APIError {}
export class ClientError extends APIError {}
export class ClientParameterError extends ClientError {
  constructor() {
    super('Invalid Parameters');
  }
}
