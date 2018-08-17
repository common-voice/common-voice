require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
const locales = require('../../../locales/all.json') as string[];
export const NATIVE_NAMES = require('../../../locales/native-names.json') as {
  [key: string]: string;
};
const translatedLocales = require('../../../locales/translated.json');
import { isProduction } from '../utility';
import API from './api';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? (translatedLocales as string[])
  : locales;

export function negotiateLocales(locales: ReadonlyArray<string>) {
  return negotiateLanguages(locales, LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
  });
}

function* asMessageContextGenerator(localeMessages: string[][]) {
  for (const [locale, messages] of localeMessages) {
    const cx = new MessageContext(locale, { useIsolating: false });
    cx.addMessages(messages);
    yield cx;
  }
}

export function createCrossLocaleMessagesGenerator(
  localeMessages: string[][],
  locales: string[]
) {
  const currentLocales = negotiateLocales([...locales, ...navigator.languages]);

  localeMessages = localeMessages
    .filter(([locale]) => currentLocales.includes(locale))
    .sort(
      ([locale1], [locale2]) =>
        currentLocales.indexOf(locale1) > currentLocales.indexOf(locale2)
          ? 1
          : -1
    );

  return asMessageContextGenerator(localeMessages);
}

export async function createMessagesGenerator(api: API, userLocales: string[]) {
  const currentLocales = negotiateLocales(userLocales);

  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocaleMessages(locale),
    ])
  );

  return asMessageContextGenerator(localeMessages);
}
