/**
 * Functions to be shared across mutiple modules.
 */

const child = require('child_process');

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
export function isLeaderServer(): Promise<boolean> {
  return new Promise((res: Function, rej: Function) => {
    child.exec(
      'consul-do common-voice $(hostname) && echo success',
      (err: any, stdout: any, stderr: any) => {
        console.log('checkleader', !err, stdout.length, stderr.length);
        if (err) {
          res(false);
        } else {
          res(true);
        }
      }
    );
  });
}
