/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Generate RFC4122 compliant globally unique identifier.
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Capitalize first letter for nice display.
 */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Count the syllables in a string. Completely stolen from:
 * https://codegolf.stackexchange.com/
 *   questions/47322/how-to-count-the-syllables-in-a-word
 */
let re = /[aiouy]+e*|e(?!d$|ly).|[td]ed|le$/gi;
export function countSyllables(text: string): number {
  let matches = text.match(re);
  return matches.length;
}

/**
 * Test if we are running in the iOS native app wrapper.
 */
export function isNativeIOS(): boolean {
  return (
    window['webkit'] &&
    webkit.messageHandlers &&
    webkit.messageHandlers.scriptHandler
  );
}

export function isFirefoxFocus(): boolean {
  return navigator.userAgent.indexOf('Focus') !== -1;
}

/**
 * Test whether this is a browser on iOS.
 */
export function isIOS(): boolean {
  return /(iPod|iPhone|iPad)/i.test(window.navigator.userAgent);
}

export function isWebkit(): boolean {
  return /AppleWebKit/i.test(window.navigator.userAgent);
}

/**
 * Check whether the browser is Safari (either desktop or mobile).
 */
export function isSafari(): boolean {
  const userAgent = window.navigator.userAgent;
  /* Just checking isSafari isn't enough, because multiple browsers on iOS
   * identify as Safari. The difference is that they have a different version
   * string in the user agent. E.g. Safari has Version/<version>, Chrome has
   * CriOS/<version>, Firefox has FxiOS/<version>.
   */
  const isWebkit = this.isWebkit();
  const pretendsSafari = /Safari/i.test(userAgent);
  const isSafari = /Version/i.test(userAgent);
  return isWebkit && pretendsSafari && isSafari;
}

/**
 * Check whether the browser is mobile Safari (i.e. on iOS).
 *
 * The logic is collected from answers to this SO question: https://stackoverflow.com/q/3007480
 */
export function isMobileWebkit(): boolean {
  return (
    this.isIOS() &&
    this.isWebkit() &&
    !/(Chrome|CriOS|OPiOS)/.test(window.navigator.userAgent)
  );
}

export function isProduction(): boolean {
  return window.location.origin === 'https://voice.mozilla.org';
}

export function getItunesURL(): string {
  return 'https://itunes.apple.com/us/app/project-common-voice-by-mozilla/id1240588326';
}

/**
 * Returns a promise that resolves after ms.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Replaces the locale part of a given path
 */
export function replacePathLocale(pathname: string, locale: string) {
  const pathParts = pathname.split('/');
  pathParts[1] = locale;
  return pathParts.join('/');
}
