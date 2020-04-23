import { UserClient } from 'common';

const SEARCH_REG_EXP = new RegExp('</?[^>]+(>|$)', 'g');

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

function dec2hex(n: number) {
  return ('0' + n.toString(16)).substr(-2);
}

export function generateToken(length = 40) {
  const arr = new Uint8Array(length / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
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
 * Test whether this is a browser on iOS.
 */
export function isIOS(): boolean {
  return /iPod|iPhone|iPad/i.test(window.navigator.userAgent);
}

/**
 * Check whether the browser is mobile Safari on iOS.
 *
 * The logic is collected from answers to this SO question: https://stackoverflow.com/q/3007480
 */
export function isMobileSafari(): boolean {
  return (
    isIOS() &&
    !window.navigator.standalone &&
    /AppleWebKit/i.test(window.navigator.userAgent) &&
    !/Chrome|Focus|CriOS|OPiOS|FxiOS|mercury/i.test(window.navigator.userAgent)
  );
}

export function isMobileResolution(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function isProduction(): boolean {
  return window.location.origin === 'https://voice.mozilla.org';
}

export function isStaging(): boolean {
  return window.location.origin === 'https://voice.allizom.org';
}

/**
 * Replaces the locale part of a given path
 */
export function replacePathLocale(pathname: string, locale: string) {
  const pathParts = pathname.split('/');
  pathParts[1] = locale;
  return pathParts.join('/');
}

export function getManageSubscriptionURL(account: UserClient) {
  const firstLanguage = account.locales[0];
  return `https://www.mozilla.org/${
    firstLanguage ? firstLanguage.locale + '/' : ''
  }newsletter/existing/${account.basket_token}`;
}

export async function hash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return [...new Uint8Array(digest)]
    .map(value => value.toString(16).padStart(2, '0'))
    .join('');
}

export function stringContains(haystack: string, needles: string) {
  return (
    haystack
      .toUpperCase()
      .replace(SEARCH_REG_EXP, '')
      .indexOf(needles) !== -1
  );
}

export function doNotTrack() {
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
}
