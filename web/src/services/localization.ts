require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import { isProduction } from '../utility';
import API from './api';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? [DEFAULT_LOCALE]
  : [
      'es-CL',
      'ca',
      'zh-TW',
      'el',
      'en',
      'nn-NO',
      'id',
      'sv-SE',
      'sk',
      'tt',
      'cv',
      'tr',
      'de',
      'cs',
      'cy',
      'th',
      'pt-BR',
      'ru',
      'mk',
      'fr',
      'pl',
      'fy-NL',
      'he',
      'zh-CN',
      'nl',
      'sq',
    ];

export function negotiateLocales(locales: string[]) {
  return negotiateLanguages(locales, LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
  });
}

function asMessageContextGenerator(localeMessages: string[][]) {
  return function*(): any {
    for (const [locale, messages] of localeMessages) {
      const cx = new MessageContext(locale);
      cx.addMessages(messages);
      yield cx;
    }
  };
}

export async function createCrossLocaleMessagesGenerator(
  api: API,
  locale: string
) {
  const currentLocales = negotiateLocales([locale, ...navigator.languages]);
  const localeMessages = Object.entries(await api.fetchCrossLocaleMessages())
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
