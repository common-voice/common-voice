/**
 * Functions to be shared across multiple modules.
 */

import { exec } from 'child_process';

const md5 = require('js-md5');
const DEFAULT_SALT = '8shd9fg3oi0fj';

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
 * Returns the file extension of some path.
 */
export function getFileExt(path: string): string {
  let i = path.lastIndexOf('.');
  if (i === -1) {
    return '';
  }
  return path.substr(i - path.length);
}

/**
 * Returns the first defined argument. Returns null if there are no defined
 * arguments.
 */
export function getFirstDefined(...options: any[]) {
  for (var i = 0; i < options.length; i++) {
    if (options[i] !== undefined) {
      return options[i];
    }
  }
  return null;
}

/**
 * Are we the chosen one?
 * Returns promise which resolves to true is we are the master deploy server.
 */
export function isLeaderServer(environment: string, version: number): Promise<boolean> {
  // Local server is always the leader.
  if (!environment || environment === 'default') {
    return Promise.resolve(true);
  }

  return new Promise((res: Function, rej: Function) => {
    exec(
      `consul-do common-voice-${environment}-${version + 2} $(hostname)`,
      (err: any, stdout: any, stderr: any) => {
        if (err) {
          res(false);
        } else {
          res(true);
        }
      }
    );
  });
}

/**
 * Returns a promise that resolves after ms.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
