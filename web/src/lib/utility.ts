/**
 * Functions to be shared across mutiple modules.
 */

/**
 * Get some random string in a certain format.
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
  return window['webkit'] && webkit.messageHandlers &&
         webkit.messageHandlers.scriptHandler;
}

export function isFocus(): boolean {
  return navigator.userAgent.indexOf('Focus') !== -1;
}

export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isProduction(): boolean {
  return window.location.origin === 'https://voice.mozilla.org';
}

export function getItunesURL(): string {
  return 'https://itunes.apple.com/us/app/project-common-voice-by-mozilla/id1240588326';
}
