/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Runtime checks.
 */
export function assert(c: any, message: string = "") {
  if (!c) {
    throw new Error(message);
  }
}

/**
 * Get some random string in a certain format.
 */
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// TODO: Move this functionality into a player module.
/**
 * Generate and save userid, return that from now on.
 */
export function getUserId() {
  if (localStorage.userId) {
    return localStorage.userId;
  }
  localStorage.userId = generateGUID();
  return localStorage.userId;
}
