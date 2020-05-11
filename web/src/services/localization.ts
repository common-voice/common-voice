require('fluent-intl-polyfill');
const { FluentBundle } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
const locales = require('../../../locales/all.json') as string[];
export const NATIVE_NAMES = require('../../../locales/native-names.json') as {
  [key: string]: string;
};
const translatedLocales = require('../../../locales/translated.json');
import { Flags } from '../stores/flags';
import { isProduction } from '../utility';
import API from './api';
import MessageOverwrites = Flags.MessageOverwrites;

export const SEGMENT_LOCALES: string[] = [
  'en',
  'ar',
  'ca',
  'de',
  'es',
  'fr',
  'nl',
  'pl',
  'pt',
  'ru',
  'ta',
  'tr',
  'tt',
];

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? (translatedLocales as string[])
  : locales;

export function negotiateLocales(locales: ReadonlyArray<string>) {
  return negotiateLanguages(locales, LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
  });
}

function* asBundleGenerator(
  localeMessages: string[][],
  messageOverwrites?: MessageOverwrites
) {
  for (const [locale, messages] of localeMessages) {
    const bundle = new FluentBundle(locale, { useIsolating: false });
    bundle.addMessages(
      messages +
        (messageOverwrites?.[locale] ? '\n' + messageOverwrites[locale] : '')
    );
    yield bundle;
  }
}

export function createCrossLocaleBundleGenerator(
  localeMessages: string[][],
  locales: string[]
) {
  const currentLocales = negotiateLocales([...locales, ...navigator.languages]);

  localeMessages = localeMessages
    .filter(([locale]) => currentLocales.includes(locale))
    .sort(([locale1], [locale2]) =>
      currentLocales.indexOf(locale1) > currentLocales.indexOf(locale2) ? 1 : -1
    );

  return asBundleGenerator(localeMessages);
}

export async function createBundleGenerator(
  api: API,
  userLocales: string[],
  messageOverwrites: MessageOverwrites
) {
  const currentLocales = negotiateLocales(userLocales);

  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocaleMessages(locale),
    ])
  );

  return asBundleGenerator(localeMessages, messageOverwrites);
}
