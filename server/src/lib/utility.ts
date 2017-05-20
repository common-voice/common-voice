/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Returns the file extension of some path.
 */
export function getFileExt(path: string): string {
  return path.substr(path.lastIndexOf('.') - path.length);
}
