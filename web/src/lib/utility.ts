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

export function isFocus(): boolean {
  return navigator.userAgent.indexOf('Focus') !== -1;
}

/**
 * Check whether the browser is mobile Safari (i.e. on iOS).
 * 
 * The logic is collected from answers to this SO question: https://stackoverflow.com/q/3007480
 */
export function isMobileSafari(): boolean {
  const userAgent = window.navigator.userAgent;
  const isIOS = /(iPod|iPhone|iPad)/i.test(userAgent);
  const isWebkit = /AppleWebKit/i.test(userAgent);
  const isIOSSafari =
    isIOS && isWebkit && !/(Chrome|CriOS|OPiOS)/.test(userAgent);
  return isIOSSafari;
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
