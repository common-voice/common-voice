/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Returns the file extension of some path.
 */
export function getFileExt(path: string): string {
  return path.substr(path.lastIndexOf('.') - path.length);
}

/**
 * Returns the first defined argument. Returns null if there are no defined
 * arguments.
 */
export function getFirstDefined(...options) {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] !== undefined) {
      return arguments[i];
    }
  }
  return null;
}
