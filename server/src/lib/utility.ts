const md5 = require('js-md5');
const DEFAULT_SALT = '8shd9fg3oi0fj';
const SENTENCE_SALT = '8hd3e8sddFSdfj';
import * as crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

/**
 * Default hashing function
 */
export function hash(str: string, salt?: string): string {
  return md5(str + (salt || DEFAULT_SALT));
}

/**
 * Used to hash sentences in import-sentences.ts
 */
export function hashSentence(str: string): string {
  return crypto.createHmac('sha256', SENTENCE_SALT).update(str).digest('hex');
}

/**
 * Create sentence id hash over sentence and locale id
 */
export function   createSentenceId(sentence: string, localeId: number): string {
  return hashSentence(`${localeId}:${sentence}`);
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
  status: StatusCodes;
  constructor(message?: string, status: StatusCodes = StatusCodes.BAD_REQUEST) {
    // 'Error' breaks prototype chain here
    super(message);
    // restore prototype chain
    this.status = status;
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = new.target.prototype;
    }
  }
}
export class ServerError extends APIError {}
export class BadRequestError extends APIError {}
export class ClientError extends APIError {}
export class ClientParameterError extends ClientError {
  constructor() {
    super('Invalid Parameters');
  }
}
