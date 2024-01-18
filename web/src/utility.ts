import { UserClient } from 'common';
import URLS from './urls';

const SEARCH_REG_EXP = new RegExp('</?[^>]+(>|$)', 'g');
const MS_IN_HOUR = 3600000;

/**
 * Generate RFC4122 compliant globally unique identifier.
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
 *
 * NOTE: As of early 2020 this is not reliable on iPad for some privacy-minded
 * browsers, including Safari (!!), Brave, and Firefox Focus.
 */
export function isIOS(): boolean {
  return /iPod|iPhone|iPad|iOS/i.test(window.navigator.userAgent);
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
    !/Chrome|Focus|CriOS|OPiOS|OPT\/|FxiOS|EdgiOS|mercury/i.test(
      window.navigator.userAgent
    )
  );
}

export function isMobileResolution(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function isProduction(): boolean {
  return window.location.origin === URLS.HTTP_ROOT;
}

export function isStaging(): boolean {
  return window.location.origin === URLS.STAGING_ROOT;
}

export function shouldEmitErrors(): boolean {
  return isStaging() || isProduction() ? true : false;
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
  const [firstLanguage] = account.languages;
  return `https://www.mozilla.org/${
    firstLanguage ? firstLanguage.locale + '/' : ''
  }newsletter/existing/${account.basket_token}`;
}

export const getAudioFormat = (() => {
  const preferredFormat = 'audio/ogg; codecs=opus';
  const audio = document.createElement('audio');
  const format = audio.canPlayType(preferredFormat)
    ? preferredFormat
    : 'audio/wav';
  return function getAudioFormat() {
    return format;
  };
})();

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
    haystack.toUpperCase().replace(SEARCH_REG_EXP, '').indexOf(needles) !== -1
  );
}

export function doNotTrack() {
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
}

export function byteToSize(bytes: number, getString: Function): string {
  const megabytes = bytes / 1024 / 1024;
  return megabytes < 1
    ? Math.round(megabytes * 100) / 100 + ' ' + getString('size-megabyte')
    : megabytes > 1024
    ? Math.round(megabytes / 1024) + ' ' + getString('size-gigabyte')
    : Math.round(megabytes) + ' ' + getString('size-megabyte');
}

export const formatBytes = (bytes: number, locale: string) => {
  const sizes = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
  if (bytes > 0) {
    const DECIMAL_PLACES = 2;
    const BYTES_IN_KILOBYTE = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(BYTES_IN_KILOBYTE));

    return parseFloat(
      (bytes / Math.pow(BYTES_IN_KILOBYTE, i)).toFixed(DECIMAL_PLACES)
    ).toLocaleString(locale, {
      style: 'unit',
      unit: sizes[i],
    });
  } else {
    const ZERO = 0;
    return ZERO.toLocaleString(locale, {
      style: 'unit',
      unit: sizes[ZERO],
    });
  }
};

export const msToHours = (msDuration: number) => {
  return Math.ceil(msDuration / MS_IN_HOUR);
};

export const castTrueString = (strValue: string) => strValue === 'true';
