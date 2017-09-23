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
export function getFirstDefined(...options: any[]) {
  for (var i = 0; i < options.length; i++) {
    if (options[i] !== undefined) {
      return options[i];
    }
  }
  return null;
}
